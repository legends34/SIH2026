'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/lib/content/locales';
import { DEFAULT_LOCALE, HTML_LANG } from '@/lib/content/locales';
import { t } from '@/lib/content';
import { HERO } from '@/lib/mock-data/hero';
import { facilities } from '@/lib/mock-data/facilities';
import { patients as initialPatients, patientMap } from '@/lib/mock-data/patients';
import { stockItems as initialStockItems, medicines } from '@/lib/mock-data/inventory';
import { complaints as initialComplaints } from '@/lib/mock-data/complaints';
import { records as initialRecords } from '@/lib/mock-data/records';
import { appointments as initialAppointments } from '@/lib/mock-data/appointments';
import type {
  Facility,
  Patient,
  StockItem,
  Complaint,
  HealthRecord,
  Appointment,
  StockStatus,
} from '@/types';

export interface UserSession {
  userId: string;
  role: 'CITIZEN' | 'DOCTOR' | 'PHARMACIST' | 'DISTRICT_ADMIN';
  activePatientId?: string;
  facilityId?: string;
  departmentCode?: string;
}

interface AppStateContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  session: UserSession | null;
  setSession: (s: UserSession | null) => void;
  activePatient: Patient;
  setActivePatientId: (id: string) => void;
  householdPatients: Patient[];
  
  // Data stores
  facilities: Facility[];
  appointments: Appointment[];
  stockItems: StockItem[];
  complaints: Complaint[];
  records: HealthRecord[];
  nowServing: number;
  
  // Actions
  callNextToken: () => void;
  updateStock: (medicineId: string, quantity: number) => void;
  addAppointment: (appointment: Appointment) => void;
  addComplaint: (complaint: Complaint) => void;
  addRecord: (record: HealthRecord) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

const STORAGE_SESSION_KEY = 'demo.session';
const STORAGE_LOCALE_KEY = 'locale';

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Locale State
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  
  // Session State
  const [session, setSessionState] = useState<UserSession | null>(null);
  
  // Active Patient for Citizen view
  const [activePatientId, setActivePatientIdState] = useState<string>(HERO.sunita.patientId);

  // App domain states
  const [nowServing, setNowServing] = useState<number>(HERO.appointment.nowServing);
  const [stock, setStock] = useState<StockItem[]>(initialStockItems);
  const [appts, setAppts] = useState<Appointment[]>(initialAppointments);
  const [userComplaints, setUserComplaints] = useState<Complaint[]>(initialComplaints);
  const [userRecords, setUserRecords] = useState<HealthRecord[]>(initialRecords);

  // Load from storage on mount
  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem(STORAGE_LOCALE_KEY) as Locale;
      if (storedLocale && ['en', 'hi', 'mr'].includes(storedLocale)) {
        setLocaleState(storedLocale);
        document.documentElement.lang = HTML_LANG[storedLocale];
      } else {
        document.documentElement.lang = HTML_LANG[DEFAULT_LOCALE];
      }
    } catch {
      // Storage unavailable
    }

    try {
      const storedSession = sessionStorage.getItem(STORAGE_SESSION_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession) as UserSession;
        setSessionState(parsed);
        if (parsed.activePatientId) {
          setActivePatientIdState(parsed.activePatientId);
        }
      } else {
        // Default to citizen Sunita
        const defaultSession: UserSession = {
          userId: HERO.sunita.userId,
          role: 'CITIZEN',
          activePatientId: HERO.sunita.patientId,
        };
        setSessionState(defaultSession);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  // BroadcastChannel for cross-tab realtime updates (Step 08 demo requirement)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('swasthya-demo');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'CALL_NEXT') {
          setNowServing(payload.nowServing);
        } else if (type === 'STOCK_UPDATE') {
          setStock((prev) =>
            prev.map((item) =>
              item.medicineId === payload.medicineId
                ? { ...item, currentQuantity: payload.quantity, status: payload.status }
                : item
            )
          );
        } else if (type === 'COMPLAINT_ADD') {
          setUserComplaints((prev) => [payload, ...prev]);
        } else if (type === 'RECORD_ADD') {
          setUserRecords((prev) => [payload, ...prev]);
        }
      };
    } catch {
      // BroadcastChannel not supported in some older environments
    }

    return () => {
      channel?.close();
    };
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_LOCALE_KEY, l);
      document.documentElement.lang = HTML_LANG[l];
    } catch {
      // Ignore
    }
  };

  const setSession = (s: UserSession | null) => {
    setSessionState(s);
    try {
      if (s) {
        sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(s));
        if (s.activePatientId) {
          setActivePatientIdState(s.activePatientId);
        }
      } else {
        sessionStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch {
      // Ignore
    }
  };

  const setActivePatientId = (id: string) => {
    setActivePatientIdState(id);
    if (session) {
      const updated = { ...session, activePatientId: id };
      setSessionState(updated);
      try {
        sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  const callNextToken = () => {
    const nextServing = nowServing + 1;
    setNowServing(nextServing);
    try {
      const channel = new BroadcastChannel('swasthya-demo');
      channel.postMessage({ type: 'CALL_NEXT', payload: { nowServing: nextServing } });
      channel.close();
    } catch {
      // Ignore
    }
  };

  const updateStock = (medicineId: string, quantity: number) => {
    let status: StockStatus = 'out';
    if (quantity > 50) status = 'available';
    else if (quantity > 0) status = 'low';

    setStock((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId
          ? { ...item, currentQuantity: quantity, status }
          : item
      )
    );

    try {
      const channel = new BroadcastChannel('swasthya-demo');
      channel.postMessage({
        type: 'STOCK_UPDATE',
        payload: { medicineId, quantity, status },
      });
      channel.close();
    } catch {
      // Ignore
    }
  };

  const addAppointment = (appt: Appointment) => {
    setAppts((prev) => [appt, ...prev]);
  };

  const addComplaint = (complaint: Complaint) => {
    setUserComplaints((prev) => [complaint, ...prev]);
    try {
      const channel = new BroadcastChannel('swasthya-demo');
      channel.postMessage({ type: 'COMPLAINT_ADD', payload: complaint });
      channel.close();
    } catch {
      // Ignore
    }
  };

  const addRecord = (record: HealthRecord) => {
    setUserRecords((prev) => [record, ...prev]);
    try {
      const channel = new BroadcastChannel('swasthya-demo');
      channel.postMessage({ type: 'RECORD_ADD', payload: record });
      channel.close();
    } catch {
      // Ignore
    }
  };

  // Sunita household: Sunita (pat_0001), Ramesh (pat_0002), Aarav (pat_0003)
  const householdPatients: Patient[] = [
    patientMap.get(HERO.sunita.patientId) ?? initialPatients[0]!,
    patientMap.get(HERO.ramesh.patientId) ?? initialPatients[1]!,
    patientMap.get(HERO.aarav.patientId) ?? initialPatients[2]!,
  ];

  const activePatient =
    patientMap.get(activePatientId as any) ??
    householdPatients.find((p) => p.id === activePatientId) ??
    householdPatients[0]!;

  const translate = (key: string, vars?: Record<string, string | number>) =>
    t(locale, key, vars);

  return (
    <AppStateContext.Provider
      value={{
        locale,
        setLocale,
        t: translate,
        session,
        setSession,
        activePatient,
        setActivePatientId,
        householdPatients,
        facilities,
        appointments: appts,
        stockItems: stock,
        complaints: userComplaints,
        records: userRecords,
        nowServing,
        callNextToken,
        updateStock,
        addAppointment,
        addComplaint,
        addRecord,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
