import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface BowlImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function BowlImage({ src, alt, className = '' }: BowlImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4EFF6] via-[#EAE3EE] to-[#DDD2E4] text-[#3B1248] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-6 h-6 mb-1.5 opacity-70" strokeWidth={1.5} />
        <span className="font-display text-sm font-medium leading-tight max-w-[16ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
