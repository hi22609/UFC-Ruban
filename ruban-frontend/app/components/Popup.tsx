'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Countdown from './Countdown';

export default function Popup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ruban_popup_dismissed');
    if (!dismissed) {
      const id = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(id);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('ruban_popup_dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm w-full">
      <div className="card border-gold/40 shadow-[0_0_40px_rgba(251,191,36,0.18)] relative">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted hover:text-white text-xl leading-none"
          aria-label="Dismiss"
        >×</button>
        <div className="text-xs uppercase tracking-[0.18em] text-gold font-bold mb-3">White House Window Closing</div>
        <Countdown className="mb-3" />
        <p className="text-sm text-muted mb-4 leading-relaxed">
          $1M+ projected member profits from this card. Early access means pre-movement odds.
        </p>
        <Link href="/pricing" className="btn-primary w-full text-center text-sm">
          GET ACCESS NOW
        </Link>
      </div>
    </div>
  );
}
