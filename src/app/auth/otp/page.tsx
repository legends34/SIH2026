'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';

export default function OtpPage() {
  const router = useRouter();
  const { t, setSession } = useAppState();
  const [otp, setOtp] = useState('123456');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Sign in as citizen Sunita
    setSession({
      userId: HERO.sunita.userId,
      role: 'CITIZEN',
      activePatientId: HERO.sunita.patientId,
    });
    router.push('/patient');
  };

  return (
    <div className="auth-wrapper" style={{ maxWidth: 500, margin: '2.5rem auto' }}>
      <div className="card" style={{ padding: '2.25rem', borderTop: '4px solid var(--teal-600)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--teal-50)', marginBottom: '0.75rem', fontSize: '1.75rem', border: '1px solid var(--teal-100)' }}>
            🔐
          </div>
          <h1 className="page-title" style={{ fontSize: '1.6rem' }}>
            {t('auth.otp.title') || 'Verify OTP'}
          </h1>
          <p className="page-subtitle">
            {t('auth.otp.subtitle') || 'Enter the 6-digit code sent to your mobile phone'}
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="otp-input" className="form-label">
              {t('auth.otp.otpLabel') || '6-Digit OTP / 6 अंकों का ओटीपी'}
            </label>
            <input
              id="otp-input"
              type="text"
              className="form-input"
              data-testid="auth-otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              style={{ fontSize: '1.5rem', letterSpacing: '0.35em', textAlign: 'center', fontWeight: 800 }}
              required
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--emerald-800)', display: 'block', marginTop: '0.45rem', textAlign: 'center', padding: '0.35rem 0.65rem', background: 'var(--emerald-50)', borderRadius: 'var(--radius-xs)' }}>
              ✓ Demo mode: any 6 digits accepted
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-teal btn-full"
            data-testid="auth-verify"
            style={{ marginTop: '1.25rem' }}
          >
            {t('auth.otp.verify') || 'Verify & Continue / सत्यापित करें'} ➔
          </button>
        </form>
      </div>
    </div>
  );
}
