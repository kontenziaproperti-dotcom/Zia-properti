'use client';

import dynamic from 'next/dynamic';

const ExistingZiaApp = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex items-center justify-center px-6 text-sm text-stone-500"
    >
      Memuat situs ZIA Properti...
    </div>
  ),
});

export default function ZiaAppShell() {
  return <ExistingZiaApp />;
}
