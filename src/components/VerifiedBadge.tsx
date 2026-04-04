'use client';

import { CheckCircle2 } from 'lucide-react';

export function VerifiedBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'md'
    ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium'
    : 'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium';

  return (
    <span className={cls} title="Phone verified listing">
      <CheckCircle2 className={size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      Verified
    </span>
  );
}
