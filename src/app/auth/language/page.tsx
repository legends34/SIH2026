'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { LOCALES, LOCALE_NATIVE_NAME, type Locale } from '@/lib/content/locales';

export default function LanguageSelectPage() {
  const router = useRouter();
  const { setLocale, t } = useAppState();

  const handleSelectLanguage = (l: Locale) => {
    setLocale(l);
    router.push('/auth/login');
  };

  const languageDescriptions: Record<Locale, { title: string; subtitle: string; flag: string }> = {
    hi: { title: 'हिन्दी', subtitle: 'अपनी भाषा चुनें · Choose Hindi', flag: '🇮🇳' },
    en: { title: 'English', subtitle: 'Standard English · Choose English', flag: '🌐' },
    mr: { title: 'मराठी', subtitle: 'आपली भाषा निवडा · Choose Marathi', flag: '🚩' },
  };

  return (
    <div className="auth-wrapper" style={{ maxWidth: 560, margin: '2.5rem auto' }}>
      <div className="card" style={{ padding: '2.25rem', borderTop: '4px solid var(--saffron-500)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-50)', marginBottom: '0.75rem', fontSize: '1.75rem', border: '1px solid var(--primary-100)' }}>
            🌐
          </div>
          <h1 className="page-title" style={{ fontSize: '1.6rem' }}>
            {t('auth.language.title') || 'Select Your Language / भाषा चुनें'}
          </h1>
          <p className="page-subtitle">
            {t('auth.language.subtitle') || 'Choose your preferred language for government healthcare services'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {LOCALES.map((loc) => {
            const info = languageDescriptions[loc];
            return (
              <button
                key={loc}
                type="button"
                className="btn card-clickable"
                data-testid={`lang-option-${loc}`}
                onClick={() => handleSelectLanguage(loc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{info.flag}</span>
                  <div>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary-900)', display: 'block' }}>
                      {info.title}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {info.subtitle}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '1.25rem', color: 'var(--saffron-500)', fontWeight: 800 }}>➔</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
