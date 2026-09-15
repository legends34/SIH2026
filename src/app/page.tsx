'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';

export default function RootPage() {
  const router = useRouter();
  const { session } = useAppState();

  useEffect(() => {
    if (session?.role === 'DOCTOR') {
      router.replace('/doctor');
    } else if (session?.role === 'PHARMACIST') {
      router.replace('/pharmacist');
    } else if (session?.role === 'DISTRICT_ADMIN') {
      router.replace('/admin');
    } else {
      router.replace('/auth/language');
    }
  }, [router, session]);

  return (
    <div className="state-container loading-state">
      <div className="spinner" />
      <p className="state-text">Redirecting to Swasthya Healthcare Portal...</p>
    </div>
  );
}
