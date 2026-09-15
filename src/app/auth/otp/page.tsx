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
    <div className="auth-wrapper" style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🔐</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
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
              style={{ fontSize: '1.4rem', letterSpacing: '0.3em', textAlign: 'center' }}
              required
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'block', marginTop: '0.35rem', textAlign: 'center' }}>
              ✓ Demo mode: any 6 digits accepted
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-full"
            data-testid="auth-verify"
            style={{ marginTop: '1rem' }}
          >
            {t('auth.otp.verify') || 'Verify & Continue / सत्यापित करें'} ➔
          </button>
        </form>
      </div>
    </div>
  );
}
