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
    <div className="auth-wrapper" style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>📱</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
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
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'block', marginTop: '0.35rem' }}>
              ℹ️ Demo account pre-filled: Sunita Sharma (+91 90000 00001)
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            data-testid="auth-send-otp"
            style={{ marginTop: '1rem' }}
          >
            {t('auth.login.sendOtp') || 'Get OTP / ओटीपी प्राप्त करें'} ➔
          </button>
        </form>
      </div>
    </div>
  );
}
