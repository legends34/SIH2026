'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { LOCALES, LOCALE_NATIVE_NAME, type Locale } from '@/lib/content/locales';
import { HERO } from '@/lib/mock-data/hero';

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
      <div className="header-container">
        <div className="header-brand-group">
          <Link href={session?.role === 'DOCTOR' ? '/doctor' : session?.role === 'PHARMACIST' ? '/pharmacist' : session?.role === 'DISTRICT_ADMIN' ? '/admin' : '/patient'} className="brand-logo">
            <span className="brand-emblem">🏥</span>
            <div className="brand-text">
              <span className="brand-title">स्वास्थ्य</span>
              <span className="brand-sub">Swasthya · National Health Portal</span>
            </div>
          </Link>
        </div>

        {/* Header Controls */}
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
              >
                {householdPatients.map((p) => (
                  <option key={p.id} value={p.id} data-testid="patient-switcher-option">
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

      {/* Navigation Sub-bar for Citizens */}
      {!isAuthPage && session?.role === 'CITIZEN' && (
        <nav className="patient-nav">
          <div className="nav-container">
            <Link href="/patient" className={`nav-link ${pathname === '/patient' ? 'active' : ''}`}>
              🏠 {t('patientHome.title') || 'Home'}
            </Link>
            <Link href="/patient/triage" className={`nav-link ${pathname.startsWith('/patient/triage') ? 'active' : ''}`}>
              🩺 {t('triage.intro.title') || 'Triage'}
            </Link>
            <Link href="/patient/facilities" className={`nav-link ${pathname.startsWith('/patient/facilities') || pathname.startsWith('/patient/book') ? 'active' : ''}`}>
              🏥 {t('facilities.title') || 'Facilities'}
            </Link>
            <Link href={`/patient/queue/${HERO.phcId}`} className={`nav-link ${pathname.startsWith('/patient/queue') ? 'active' : ''}`}>
              ⏱️ {t('queue.title') || 'Live Queue'}
            </Link>
            <Link href="/patient/records" className={`nav-link ${pathname.startsWith('/patient/records') ? 'active' : ''}`}>
              📋 {t('records.title') || 'Records'}
            </Link>
            <Link href="/patient/medicines" className={`nav-link ${pathname.startsWith('/patient/medicines') ? 'active' : ''}`}>
              💊 {t('medicines.title') || 'Medicines'}
            </Link>
            <Link href="/patient/complaints/new" className={`nav-link ${pathname.startsWith('/patient/complaints') ? 'active' : ''}`}>
              📢 {t('complaints.title') || 'Grievance'}
            </Link>
            <Link href="/patient/profile" className={`nav-link ${pathname.startsWith('/patient/profile') ? 'active' : ''}`}>
              👤 {t('profile.title') || 'Profile'}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
