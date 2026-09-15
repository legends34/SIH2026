'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { LOCALES, LOCALE_NATIVE_NAME, type Locale } from '@/lib/content/locales';
import { HERO } from '@/lib/mock-data/hero';
import { MaharashtraEmblemPlaceholder } from './maharashtra-emblem';

export function Header() {
  const { locale, setLocale, t, session, setSession, activePatient, setActivePatientId, householdPatients } = useAppState();
  const pathname = usePathname();
  const router = useRouter();

  // Switch demo persona
  const handleRoleChange = (role: 'CITIZEN' | 'DOCTOR' | 'PHARMACIST' | 'DISTRICT_ADMIN') => {
    if (role === 'CITIZEN') {
      setSession({
        userId: HERO.sunita.userId,
        role: 'CITIZEN',
        activePatientId: HERO.sunita.patientId,
      });
      router.push('/patient');
    } else if (role === 'DOCTOR') {
      setSession({
        userId: HERO.doctor.userId,
        role: 'DOCTOR',
        facilityId: HERO.doctor.facilityId,
      });
      router.push('/doctor');
    } else if (role === 'PHARMACIST') {
      setSession({
        userId: HERO.pharmacist.userId,
        role: 'PHARMACIST',
        facilityId: HERO.pharmacist.facilityId,
      });
      router.push('/pharmacist');
    } else if (role === 'DISTRICT_ADMIN') {
      setSession({
        userId: HERO.districtAdmin.userId,
        role: 'DISTRICT_ADMIN',
      });
      router.push('/admin');
    }
  };

  const isAuthPage = pathname.startsWith('/auth');

  return (
    <header className="site-header">
      {/* ── Tier 1: Government Authority Bar ── */}
      <div className="gov-top-bar">
        <div className="header-container gov-top-container">
          <div className="gov-identity-group">
            <MaharashtraEmblemPlaceholder size={38} className="gov-seal-svg" />
            <div className="gov-title-stack">
              <span className="gov-state-name">महाराष्ट्र शासन · Government of Maharashtra</span>
              <span className="gov-dept-name">सार्वजनिक आरोग्य विभाग · Public Health Department</span>
            </div>
          </div>

          <div className="header-controls">
            {/* Household Switcher for Citizen */}
            {!isAuthPage && session?.role === 'CITIZEN' && (
              <div className="patient-quick-switcher">
                <label htmlFor="header-patient-select" className="sr-only">Active Patient</label>
                <select
                  id="header-patient-select"
                  value={activePatient.id}
                  onChange={(e) => setActivePatientId(e.target.value)}
                  className="select-control patient-select"
                  title="Switch family member"
                >
                  {householdPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      👤 {p.name} ({p.sex === 'F' ? 'F' : p.sex === 'M' ? 'M' : 'O'}, {Math.floor((Date.now() - new Date(p.dob).getTime()) / (365.25 * 24 * 3600 * 1000))}y)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Role Switcher for judges / presentation */}
            <div className="role-switcher">
              <select
                value={session?.role ?? 'CITIZEN'}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="select-control role-select"
                title="Switch demo persona"
              >
                <option value="CITIZEN">👤 {t('common.roles.citizen') || 'Citizen'}</option>
                <option value="DOCTOR">🩺 {t('common.roles.doctor') || 'Doctor'}</option>
                <option value="PHARMACIST">💊 {t('common.roles.pharmacist') || 'Pharmacist'}</option>
                <option value="DISTRICT_ADMIN">📊 {t('common.roles.admin') || 'District Admin'}</option>
              </select>
            </div>

            {/* Language Selector */}
            <div className="language-selector">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="select-control lang-select"
                aria-label="Select Language"
              >
                {LOCALES.map((l) => (
                  <option key={l} value={l}>
                    {LOCALE_NATIVE_NAME[l]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 2: Subordinate Portal Bar ── */}
      <div className="portal-sub-bar">
        <div className="header-container portal-bar-container">
          <div className="header-brand-group">
            <Link
              href={session?.role === 'DOCTOR' ? '/doctor' : session?.role === 'PHARMACIST' ? '/pharmacist' : session?.role === 'DISTRICT_ADMIN' ? '/admin' : '/patient'}
              className="brand-logo"
            >
              <div className="brand-icon-wrap">
                <span className="brand-emblem" aria-hidden="true">🏥</span>
              </div>
              <div className="brand-text">
                <div className="brand-title-row">
                  <span className="brand-title">स्वास्थ्य</span>
                  <span className="brand-badge">SWASTHYA</span>
                </div>
                <span className="brand-sub">Universal Rural Healthcare Access Architecture</span>
              </div>
            </Link>
          </div>

          <div className="portal-quick-info">
            <span className="nha-pill">ABDM Integrated</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar for Citizens */}
      {!isAuthPage && session?.role === 'CITIZEN' && (
        <nav className="patient-nav" aria-label="Citizen Portal Navigation">
          <div className="nav-container">
            <Link href="/patient" className={`nav-link ${pathname === '/patient' ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">🏠</span>
              <span>{t('patientHome.title') || 'Home'}</span>
            </Link>
            <Link href="/patient/triage" className={`nav-link ${pathname.startsWith('/patient/triage') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">🩺</span>
              <span>{t('triage.intro.title') || 'Triage'}</span>
            </Link>
            <Link href="/patient/facilities" className={`nav-link ${pathname.startsWith('/patient/facilities') || pathname.startsWith('/patient/book') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">🏥</span>
              <span>{t('facilities.title') || 'Facilities'}</span>
            </Link>
            <Link href={`/patient/queue/${HERO.phcId}`} className={`nav-link ${pathname.startsWith('/patient/queue') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">⏱️</span>
              <span>{t('queue.title') || 'Live Queue'}</span>
            </Link>
            <Link href="/patient/records" className={`nav-link ${pathname.startsWith('/patient/records') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">📋</span>
              <span>{t('records.title') || 'Records'}</span>
            </Link>
            <Link href="/patient/medicines" className={`nav-link ${pathname.startsWith('/patient/medicines') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">💊</span>
              <span>{t('medicines.title') || 'Medicines'}</span>
            </Link>
            <Link href="/patient/complaints/new" className={`nav-link ${pathname.startsWith('/patient/complaints') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">📢</span>
              <span>{t('complaints.title') || 'Grievance'}</span>
            </Link>
            <Link href="/patient/profile" className={`nav-link ${pathname.startsWith('/patient/profile') ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">👤</span>
              <span>{t('profile.title') || 'Profile'}</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
