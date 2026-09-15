'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { slots as mockSlots } from '@/lib/mock-data/slots';
import type { Appointment } from '@/types';
import { StateHandler } from '@/components/ui/states';

export default function BookingWizardPage() {
  const params = useParams();
  const facilityId = params?.facilityId as string;
  const router = useRouter();
  const { t, facilities, activePatient, addAppointment } = useAppState();

  const facility = facilities.find((f) => f.id === facilityId) ?? facilities[0]!;
  
  const [selectedDept, setSelectedDept] = useState<string>('general_opd');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot_0001');
  const [confirmedToken, setConfirmedToken] = useState<number | null>(null);

  const availableSlots = mockSlots.filter((s) => s.facilityId === facilityId) || mockSlots.slice(0, 3);
  const slotsToDisplay = availableSlots.length > 0 ? availableSlots : mockSlots.slice(0, 3);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const newAppt: Appointment = {
      id: HERO.appointment.id,
      slotId: selectedSlotId as any,
      patientId: activePatient.id,
      facilityId: facility.id,
      departmentCode: selectedDept,
      tokenNumber: HERO.appointment.tokenNumber,
      status: 'booked',
      isWalkIn: false,
      bookedAt: '2026-09-15T08:30:00+05:30',
      updatedAt: '2026-09-15T08:30:00+05:30',
    };

    addAppointment(newAppt);
    setConfirmedToken(HERO.appointment.tokenNumber);
    router.push(`/patient/appointments/${newAppt.id}`);
  };

  return (
    <StateHandler>
      <div className="booking-page" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="page-header">
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
            {facility.name}
          </span>
          <h1 className="page-title">
            {t('booking.title') || 'Book OPD Consultation'}
          </h1>
          <p className="page-subtitle">
            Booking for patient: <strong>{activePatient.name}</strong>
          </p>
        </div>

        {confirmedToken && (
          <div className="card" style={{ background: 'var(--emerald-50)', border: '2px solid var(--emerald-600)', textAlign: 'center', padding: '2rem' }}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-800)', marginTop: '0.5rem' }}>
              Booking Confirmed!
            </h2>
            <div style={{ margin: '1rem 0' }}>
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--slate-600)' }}>Your Token Number</span>
              <p className="token-huge" data-testid="token-number" style={{ color: 'var(--emerald-800)' }}>
                {confirmedToken}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleConfirm}>
          {/* 1. Department Selection */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>
              1. Select Department / विभाग चुनें
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {facility.departments.map((dept) => (
                <label
                  key={dept}
                  data-testid={`department-option-${dept}`}
                  className="card-clickable"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.9rem 1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${selectedDept === dept ? 'var(--primary-700)' : 'var(--slate-200)'}`,
                    background: selectedDept === dept ? 'var(--primary-50)' : 'var(--white)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="dept"
                    value={dept}
                    checked={selectedDept === dept}
                    onChange={() => setSelectedDept(dept)}
                  />
                  <strong style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                    {dept.replace(/_/g, ' ')}
                  </strong>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Session Slot Selection */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>
              2. Select Time Session / समय स्लॉट
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {slotsToDisplay.map((slot, idx) => (
                <button
                  key={slot.id || idx}
                  type="button"
                  data-testid="slot-option"
                  onClick={() => setSelectedSlotId(slot.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${selectedSlotId === slot.id ? 'var(--primary-700)' : 'var(--slate-200)'}`,
                    background: selectedSlotId === slot.id ? 'var(--primary-50)' : 'var(--white)',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'block', fontWeight: 600 }}>
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)', display: 'block', marginTop: '0.2rem' }}>
                    {idx === 0 ? 'Morning OPD' : idx === 1 ? 'Mid-Day OPD' : 'Afternoon OPD'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--emerald-800)', fontWeight: 600 }}>
                    Available
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            data-testid="booking-confirm"
            style={{ fontSize: '1.1rem', padding: '1rem' }}
          >
            {t('booking.confirm.button') || 'Confirm Appointment & Generate Token'} ➔
          </button>
        </form>
      </div>
    </StateHandler>
  );
}
