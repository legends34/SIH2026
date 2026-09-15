'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useAppState();
  const [phone, setPhone] = useState('+91 90000 00001');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/auth/otp');
  };

  return (
    <div className="auth-wrapper" style={{ maxWidth: 500, margin: '2.5rem auto' }}>
      <div className="card" style={{ padding: '2.25rem', borderTop: '4px solid var(--primary-900)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-50)', marginBottom: '0.75rem', fontSize: '1.75rem', border: '1px solid var(--primary-100)' }}>
            📱
          </div>
          <h1 className="page-title" style={{ fontSize: '1.6rem' }}>
            {t('auth.login.title') || 'Citizen Login'}
          </h1>
          <p className="page-subtitle">
            {t('auth.login.subtitle') || 'Enter your mobile number to access family healthcare services'}
          </p>
        </div>

        <form onSubmit={handleSendOtp}>
          <div className="form-group">
            <label htmlFor="phone-input" className="form-label">
              {t('auth.login.phoneLabel') || 'Mobile Number / मोबाइल नंबर'}
            </label>
            <input
              id="phone-input"
              type="tel"
              className="form-input"
              data-testid="auth-phone-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 90000 00001"
              required
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.45rem', padding: '0.35rem 0.65rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
              ℹ️ Demo account pre-filled: Sunita Sharma (+91 90000 00001)
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            data-testid="auth-send-otp"
            style={{ marginTop: '1.25rem' }}
          >
            {t('auth.login.sendOtp') || 'Get OTP / ओटीपी प्राप्त करें'} ➔
          </button>
        </form>
      </div>
    </div>
  );
}
