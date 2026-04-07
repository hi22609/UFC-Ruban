'use client';
import { useEffect, useState } from 'react';

const TARGET = new Date('2026-04-12T22:00:00-04:00').getTime();

export default function Countdown({ className = '' }: { className?: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`flex flex-wrap gap-3 sm:gap-4 items-stretch ${className}`}>
      {[['DAYS', t.d], ['HRS', t.h], ['MIN', t.m], ['SEC', t.s]].map(([label, val]) => (
        <div
          key={label as string}
          className="min-w-[72px] flex-1 rounded-2xl border border-gold/15 bg-white/[0.03] px-3 py-3 text-center sm:min-w-[84px]"
        >
          <div className="text-3xl md:text-4xl font-extrabold font-mono text-gold leading-none">{pad(val as number)}</div>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-muted mt-2 whitespace-nowrap">{label}</div>
        </div>
      ))}
    </div>
  );
}
