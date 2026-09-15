'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="gov-footer" role="contentinfo">
      {/* Emergency Callout Band */}
      <div className="gov-footer-emergency">
        <div className="gov-footer-container emergency-grid">
          <div className="emergency-item">
            <span className="emergency-tag">🚨 24x7 Ambulance</span>
            <a href="tel:108" className="emergency-number">108</a>
          </div>
          <div className="emergency-item">
            <span className="emergency-tag">🩺 State Health Helpline</span>
            <a href="tel:104" className="emergency-number">104</a>
          </div>
          <div className="emergency-item">
            <span className="emergency-tag">🛡️ National Emergency</span>
            <a href="tel:112" className="emergency-number">112</a>
          </div>
          <div className="emergency-item">
            <span className="emergency-tag">📞 Mental Health Support (Tele-MANAS)</span>
            <a href="tel:14416" className="emergency-number">14416</a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Dept Info */}
      <div className="gov-footer-main">
        <div className="gov-footer-container footer-cols">
          {/* Department Branding */}
          <div className="footer-col col-brand">
            <div className="gov-seal-title">
              <strong>सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन</strong>
              <span>Public Health Department, Government of Maharashtra</span>
            </div>
            <p className="footer-desc">
              Digital Healthcare Access Initiative under Ayushman Bharat Digital Mission (ABDM) standards, ensuring universal healthcare coverage, intelligent clinical triage, and transparent medicine distribution.
            </p>
            <div className="portal-compliance">
              <span className="compliance-tag">ABDM Compliant M1/M2/M3</span>
              <span className="compliance-tag">Aadhaar / ABHA Verified</span>
              <span className="compliance-tag">e-Sanjeevani Compatible</span>
            </div>
          </div>

          {/* Quick Access */}
          <div className="footer-col">
            <h4 className="footer-heading">Citizen Services</h4>
            <ul className="footer-links">
              <li><Link href="/patient/triage">Symptom Assessment & Triage</Link></li>
              <li><Link href="/patient/facilities">Find Nearest PHC / CHC</Link></li>
              <li><Link href="/patient/medicines">Essential Drug Availability</Link></li>
              <li><Link href="/patient/records">Electronic Health Records (EHR)</Link></li>
              <li><Link href="/patient/complaints/new">Citizen Grievance Redressal</Link></li>
            </ul>
          </div>

          {/* Important Portals */}
          <div className="footer-col">
            <h4 className="footer-heading">Government Portals</h4>
            <ul className="footer-links">
              <li>
                <a href="https://arogya.maharashtra.gov.in" target="_blank" rel="noopener noreferrer">
                  Public Health Dept, Maharashtra ↗
                </a>
              </li>
              <li>
                <a href="https://abdm.gov.in" target="_blank" rel="noopener noreferrer">
                  Ayushman Bharat Digital Mission (ABDM) ↗
                </a>
              </li>
              <li>
                <a href="https://nha.gov.in" target="_blank" rel="noopener noreferrer">
                  National Health Authority (NHA) ↗
                </a>
              </li>
              <li>
                <a href="https://esanjeevani.in" target="_blank" rel="noopener noreferrer">
                  e-Sanjeevani Tele-Consultation ↗
                </a>
              </li>
              <li>
                <a href="https://nhp.gov.in" target="_blank" rel="noopener noreferrer">
                  National Health Portal (NHP) ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Disclaimers */}
      <div className="gov-footer-bottom">
        <div className="gov-footer-container bottom-flex">
          <p className="footer-copy">
            © 2026 Government of Maharashtra · Public Health Department. Designed for Smart India Hackathon (SIH 2026).
          </p>
          <p className="footer-disclaimer">
            All clinical recommendations and facility statuses are demonstration datasets conforming to Indian Public Health Standards (IPHS).
          </p>
        </div>
      </div>
    </footer>
  );
}
