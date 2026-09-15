'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { StateHandler } from '@/components/ui/states';

export default function NewComplaintPage() {
  const router = useRouter();
  const { t, activePatient } = useAppState();
  const [narrative, setNarrative] = useState('');
  const [facility, setFacility] = useState('fac_0005');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-categorize based on keywords
    let category = 'medicine_unavailable';
    let severity = 'high';

    const text = narrative.toLowerCase();
    if (text.includes('wait') || text.includes('delay') || text.includes('लाइन')) {
      category = 'long_wait';
      severity = 'medium';
    } else if (text.includes('staff') || text.includes('behaviour') || text.includes('व्यवहार')) {
      category = 'staff_behaviour';
      severity = 'medium';
    } else if (text.includes('clean') || text.includes('dirty') || text.includes('सफाई')) {
      category = 'cleanliness';
      severity = 'low';
    } else if (text.includes('metformin') || text.includes('medicine') || text.includes('दवा')) {
      category = 'medicine_unavailable';
      severity = 'high';
    }

    try {
      sessionStorage.setItem('demo.pending_complaint', JSON.stringify({
        narrative,
        facilityId: facility,
        category,
        severity,
        patientName: activePatient.name,
      }));
    } catch {
      // Ignore
    }

    router.push('/patient/complaints/new/preview');
  };

  return (
    <StateHandler>
      <div className="new-complaint-page" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">
            {t('complaints.title') || 'File Citizen Grievance / शिकायत दर्ज करें'}
          </h1>
          <p className="page-subtitle">
            Voice complaints regarding medicine shortages, facility wait times, or service quality
          </p>
        </div>

        <form onSubmit={handleGenerate}>
          <div className="card">
            <div className="form-group">
              <label htmlFor="comp-facility" className="form-label">
                Health Facility / स्वास्थ्य केंद्र
              </label>
              <select
                id="comp-facility"
                className="form-select"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
              >
                <option value="fac_0005">Primary Health Centre, Wazirabad (Gurugram)</option>
                <option value="fac_0001">District Hospital Gurugram</option>
                <option value="fac_0004">Community Health Centre, Farrukhnagar</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comp-narrative" className="form-label">
                Describe the Issue in Your Words / अपनी समस्या का विवरण दें
              </label>
              <textarea
                id="comp-narrative"
                className="form-textarea"
                data-testid="complaint-narrative"
                rows={5}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="उदा. मुझे दो हफ्ते से पीएचसी में मेटफॉर्मिन दवा नहीं मिल रही है... / E.g. Metformin was not available at the PHC for two weeks."
                required
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.35rem', display: 'block' }}>
                💡 Speak or type naturally. Our assistant will structure your complaint and estimate the resolution SLA.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            data-testid="complaint-generate"
            style={{ fontSize: '1.05rem', padding: '0.9rem' }}
          >
            {t('complaints.generate') || 'Generate Formal Grievance Preview'} ➔
          </button>
        </form>
      </div>
    </StateHandler>
  );
}
