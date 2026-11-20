// pt.ts: visitor id, version A or B, consent, Microsoft Clarity and event tracking
// for the Persuasive Technology module, SMU Academy, November 2026.

export const EXPERIMENT = "trigger_test";
export const CLARITY_ID = "zgi74gt88t";        // Guide 2, Step 2: your Clarity project id
export const SUPABASE_URL = "https://odtulsrfghcucrhgqyej.supabase.co";      // Guide 3, Step 6: https://<project-ref>.supabase.co
export const SUPABASE_KEY = "sb_publishable_92ekG9241TAYa0Myr9CY7Q__eZswHll";      // Guide 3, Step 6: the publishable key (sb_publishable_...), never the secret key

export type Variant = "A" | "B";
type EventName = "screen_view" | "cta_click" | "goal_complete";

function get(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function put(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage blocked */ }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function visitorId(): string {
  let id = get("pt_visitor");
  if (!id) { id = newId(); put("pt_visitor", id); }
  return id;
}

export function forcedVariant(): Variant | null {
  const v = new URLSearchParams(location.search).get("v");
  return v === "A" || v === "B" ? v : null;
}

export function variant(): Variant {
  const forced = forcedVariant();
  if (forced) return forced;
  const kept = get("pt_variant");
  if (kept === "A" || kept === "B") return kept;
  const fresh: Variant = Math.random() < 0.5 ? "A" : "B";
  put("pt_variant", fresh);
  send("assignments", { visitor_id: visitorId(), experiment: EXPERIMENT, variant: fresh });
  return fresh;
}

export function consent(): "granted" | "denied" | null {
  const c = get("pt_consent");
  return c === "granted" || c === "denied" ? c : null;
}

export function setConsent(choice: "granted" | "denied"): void {
  put("pt_consent", choice);
  if (choice !== "granted") {
    const w = window as any;
    if (w.__ptClarity) {                 // Clarity is already running on this page: tell it, then reload so it stops
      w.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      setTimeout(() => location.reload(), 3000);
    }
    return;
  }
  loadClarity();
  send("consents", { visitor_id: visitorId(), analytics: true, notice_version: "v1" });
  const kept = get("pt_variant");
  if (!forcedVariant() && (kept === "A" || kept === "B")) {
    send("assignments", { visitor_id: visitorId(), experiment: EXPERIMENT, variant: kept });
  }
  track("screen_view", { after_consent: true });   // the screen is on view at the moment of Accept
}

export function loadClarity(): void {
  const w = window as any;
  if (!CLARITY_ID || consent() !== "granted" || w.__ptClarity) return;
  w.__ptClarity = true;
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_ID);
  w.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  w.clarity("set", "variant", variant());
  w.clarity("set", "forced", forcedVariant() ? "yes" : "no");
}

export function track(event: EventName, props: Record<string, unknown> = {}): void {
  const row = {
    visitor_id: visitorId(), experiment: EXPERIMENT, variant: variant(), event,
    page: location.pathname, forced: forcedVariant() !== null, props,
  };
  const log = JSON.parse(get("pt_log") || "[]");
  log.push({ at: new Date().toISOString(), ...row });
  put("pt_log", JSON.stringify(log.slice(-50)));
  console.info("[pt] " + event, row);
  if (consent() !== "granted") return;
  const w = window as any;
  if (typeof w.clarity === "function") w.clarity("event", event);
  send("events", row);
}

function headers(): Record<string, string> {
  return { apikey: SUPABASE_KEY, "Content-Type": "application/json" };   // the publishable key goes in the apikey header only
}

function send(table: "events" | "assignments" | "consents", row: object): void {
  if (!SUPABASE_URL || !SUPABASE_KEY || consent() !== "granted") return;
  fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST", keepalive: true,
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(row),
  }).catch(() => { /* a failed send never breaks the screen */ });
}

async function rpc(fn: string, args: object): Promise<any> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST", headers: headers(), body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`${fn} failed: ${r.status}`);
  return r.json();
}

export const myData = () => rpc("my_data", { p_visitor: visitorId() });
export const deleteMyData = () => rpc("delete_my_data", { p_visitor: visitorId() });
export const variantStats = () => rpc("variant_stats", { p_experiment: EXPERIMENT });

// Add to pt.ts. Members: sign-up and sign-in with Supabase Auth, and the paid membership that Stripe reports.
export const STRIPE_LINK = "";       // Guide 3, Step 9: your Stripe Payment Link (https://buy.stripe.com/test_...)
export const STRIPE_PORTAL = "";     // Guide 3, Step 9: your Stripe customer portal link

export type Member = { id: string; email: string };
export type MembershipStatus = "none" | "active" | "canceling" | "canceled" | "past_due";
type Session = { access_token: string; refresh_token: string; expires_at: number; user: Member };

function session(): Session | null {
  try { return JSON.parse(get("pt_session") || "null"); } catch { return null; }
}

function keep(j: any): Session {
  const s: Session = {
    access_token: j.access_token, refresh_token: j.refresh_token,
    expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600),
    user: { id: j.user.id, email: j.user.email },
  };
  put("pt_session", JSON.stringify(s));
  return s;
}

async function auth(path: string, body: object): Promise<any> {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST", headers: headers(), body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.msg || j.error_description || j.message || `Request failed: ${r.status}`);
  return j;
}

async function fresh(): Promise<Session | null> {     // a session whose access token has more than a minute left
  const s = session();
  if (!s) return null;
  if (s.expires_at - 60 > Date.now() / 1000) return s;
  try { return keep(await auth("token?grant_type=refresh_token", { refresh_token: s.refresh_token })); }
  catch { put("pt_session", "null"); return null; }
}

async function asMember(path: string, init: RequestInit = {}): Promise<Response> {
  const s = await fresh();
  if (!s) throw new Error("Please sign in first.");
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {   // the publishable key names the project; the token names the member
    ...init, headers: { ...headers(), Authorization: `Bearer ${s.access_token}`, ...(init.headers as object) },
  });
}

async function addMemberRow(): Promise<void> {
  const s = session();
  if (!s) return;
  const agreed = consent() === "granted";             // the version is linked to the account only after Accept
  await asMember("members", {
    method: "POST", headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      user_id: s.user.id, experiment: EXPERIMENT, forced: forcedVariant() !== null,
      visitor_id: agreed ? visitorId() : null, variant: agreed ? variant() : null,
    }),
  }).catch(() => { /* a failed request never blocks joining */ });
}

export async function signUp(email: string, password: string): Promise<Member> {
  const j = await auth("signup", { email, password });
  if (!j.access_token) throw new Error("Confirm email is still on in Supabase. Turn it off (Guide 3, Step 5) and try again.");
  const s = keep(j);
  await addMemberRow();
  return s.user;
}

export async function signIn(email: string, password: string): Promise<Member> {
  const s = keep(await auth("token?grant_type=password", { email, password }));
  await addMemberRow();                               // refused as a duplicate when the row exists, which is fine
  return s.user;
}

export function signOut(): void {
  const s = session();
  put("pt_session", "null");
  if (s) fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST", headers: { ...headers(), Authorization: `Bearer ${s.access_token}` },
  }).catch(() => { /* signed out in this browser either way */ });
}

export function member(): Member | null {
  const s = session();
  return s ? s.user : null;
}

export async function membership(): Promise<MembershipStatus> {
  const r = await asMember("memberships?select=status");
  if (!r.ok) throw new Error(`membership failed: ${r.status}`);
  const rows = await r.json();
  return rows.length ? rows[0].status : "none";
}

export function payLink(): string {                   // Stripe sends this id back to the webhook function
  const m = member();
  return m && STRIPE_LINK ? `${STRIPE_LINK}?client_reference_id=${m.id}` : "";
}
