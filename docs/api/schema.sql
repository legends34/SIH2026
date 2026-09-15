-- ============================================================================
-- SWASTHYA PLATFORM PRODUCTION POSTGRESQL 16 SCHEMA
-- File: docs/api/schema.sql
-- Description: Complete production DDL with immutable audit hash-chain, 1:N users-patients,
--              lockable inventory rows, atomic token counters, and transactional outbox.
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Application Role Definition (Principle of Least Privilege)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'dev_app_password';
  END IF;
END
$$;

-- ============================================================================
-- MODULE 1: AUTHENTICATION & USERS
-- ============================================================================

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    phone CITEXT UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('CITIZEN', 'DOCTOR', 'PHARMACIST', 'FACILITY_ADMIN', 'DISTRICT_ADMIN', 'STATE_ADMIN')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'User authentication and role mapping. One user can manage multiple patient profiles.';

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- MODULE 2: PATIENTS & DEPENDENTS (1:N MODEL)
-- ============================================================================

CREATE TABLE patients (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    age_years INT NOT NULL CHECK (age_years >= 0 AND age_years <= 130),
    sex VARCHAR(16) NOT NULL CHECK (sex IN ('male', 'female', 'other')),
    aadhaar_last4 VARCHAR(4) CHECK (aadhaar_last4 ~ '^[0-9]{4}$'),
    preferred_language VARCHAR(8) NOT NULL DEFAULT 'hi',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE patients IS 'Patient demographic profiles managed by user accounts (1 User : N Patients).';

CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_aadhaar_last4 ON patients(aadhaar_last4);

-- Aadhaar Cryptographic Indexing Table (HMAC-SHA256, strictly zero raw Aadhaar numbers)
CREATE TABLE aadhaar_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(64) UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    hmac_digest VARCHAR(64) UNIQUE NOT NULL,
    aadhaar_last4 VARCHAR(4) NOT NULL CHECK (aadhaar_last4 ~ '^[0-9]{4}$'),
    linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE aadhaar_links IS 'HMAC-SHA256 hashed Aadhaar identifiers using isolated pepper key for deduplication.';

CREATE INDEX idx_aadhaar_links_hmac ON aadhaar_links(hmac_digest);

-- ============================================================================
-- MODULE 3: HEALTHCARE FACILITIES & DEPARTMENTS
-- ============================================================================

CREATE TABLE facilities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(32) NOT NULL CHECK (tier IN ('sub_centre', 'phc', 'chc', 'sdh', 'dh')),
    district VARCHAR(128) NOT NULL,
    taluka VARCHAR(128) NOT NULL,
    pincode VARCHAR(6) NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
    latitude NUMERIC(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE facilities IS 'Government healthcare facilities (Sub-Centres, PHCs, CHCs, District Hospitals).';

CREATE INDEX idx_facilities_district ON facilities(district);
CREATE INDEX idx_facilities_tier ON facilities(tier);
CREATE INDEX idx_facilities_geo ON facilities(latitude, longitude);

CREATE TABLE departments (
    code VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);
COMMENT ON TABLE departments IS 'Standardized clinical departments (General Medicine, Paediatrics, Obstetrics, etc.).';

CREATE TABLE facility_departments (
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    department_code VARCHAR(32) NOT NULL REFERENCES departments(code) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (facility_id, department_code)
);
COMMENT ON TABLE facility_departments IS 'Mapping of active clinical departments present at a facility.';

CREATE INDEX idx_facility_departments_dept ON facility_departments(department_code);

CREATE TABLE doctor_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registration_number VARCHAR(64) NOT NULL,
    specialization VARCHAR(128) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
);
COMMENT ON TABLE doctor_profiles IS 'Clinical credentials and availability status of medical officers.';

CREATE TABLE staff_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    department_code VARCHAR(32) REFERENCES departments(code) ON DELETE SET NULL,
    role VARCHAR(32) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE
);
COMMENT ON TABLE staff_postings IS 'Duty postings scoping staff authorizations to specific physical facilities.';

CREATE INDEX idx_staff_postings_user ON staff_postings(user_id);
CREATE INDEX idx_staff_postings_facility ON staff_postings(facility_id);

-- ============================================================================
-- MODULE 4: SLOTS, APPOINTMENTS & QUEUE MANAGEMENT
-- ============================================================================

CREATE TABLE slots (
    id VARCHAR(64) PRIMARY KEY,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    department_code VARCHAR(32) NOT NULL REFERENCES departments(code) ON DELETE RESTRICT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    booked_count INT NOT NULL DEFAULT 0 CHECK (booked_count >= 0 AND booked_count <= capacity),
    version INT NOT NULL DEFAULT 1,
    CONSTRAINT uq_facility_dept_session UNIQUE (facility_id, department_code, date, start_time)
);
COMMENT ON TABLE slots IS 'Capacity-N session blocks (Morning/Evening OPD) for patient booking.';

CREATE INDEX idx_slots_lookup ON slots(facility_id, department_code, date);

CREATE TABLE token_counters (
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    department_code VARCHAR(32) NOT NULL REFERENCES departments(code) ON DELETE RESTRICT,
    service_date DATE NOT NULL,
    last_token_number INT NOT NULL DEFAULT 0 CHECK (last_token_number >= 0),
    now_serving INT NOT NULL DEFAULT 0 CHECK (now_serving >= 0),
    avg_service_time_seconds INT NOT NULL DEFAULT 300,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (facility_id, department_code, service_date)
);
COMMENT ON TABLE token_counters IS 'Daily atomic queue token generator and now-serving progress per facility/department.';

CREATE TABLE appointments (
    id VARCHAR(64) PRIMARY KEY,
    slot_id VARCHAR(64) NOT NULL REFERENCES slots(id) ON DELETE RESTRICT,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    department_code VARCHAR(32) NOT NULL REFERENCES departments(code) ON DELETE RESTRICT,
    token_number INT NOT NULL CHECK (token_number > 0),
    status VARCHAR(32) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show')),
    is_walk_in BOOLEAN NOT NULL DEFAULT FALSE,
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE appointments IS 'Patient OPD appointment bookings and walk-in consultation tickets.';

CREATE INDEX idx_appointments_slot ON appointments(slot_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_facility_dept ON appointments(facility_id, department_code, status);

CREATE TABLE queue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    department_code VARCHAR(32) NOT NULL REFERENCES departments(code) ON DELETE RESTRICT,
    service_date DATE NOT NULL,
    token_number INT NOT NULL CHECK (token_number > 0),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    appointment_id VARCHAR(64) REFERENCES appointments(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in_consultation', 'completed', 'skipped')),
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_queue_daily_token UNIQUE (facility_id, department_code, service_date, token_number)
);
COMMENT ON TABLE queue_entries IS 'Real-time ordered waiting queue entries serving doctor consoles and display screens.';

CREATE INDEX idx_queue_entries_state ON queue_entries(facility_id, department_code, service_date, status);

-- ============================================================================
-- MODULE 5: ELECTRONIC HEALTH RECORDS & CLINICAL DATA (APPEND-ONLY)
-- ============================================================================

CREATE TABLE medical_records (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    author_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    appointment_id VARCHAR(64) REFERENCES appointments(id) ON DELETE SET NULL,
    record_type VARCHAR(32) NOT NULL CHECK (record_type IN ('consultation', 'prescription', 'lab_report', 'vaccination')),
    clinical_data JSONB NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE medical_records IS 'Append-only legal medical record entries. UPDATE and DELETE are blocked by database trigger.';

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id, recorded_at DESC);
CREATE INDEX idx_medical_records_facility ON medical_records(facility_id);

-- Enforce append-only on medical records
CREATE OR REPLACE FUNCTION prevent_record_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CANNOT_MODIFY_MEDICAL_RECORD: Medical records are append-only by regulation.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_record_tampering
BEFORE UPDATE OR DELETE ON medical_records
FOR EACH ROW EXECUTE FUNCTION prevent_record_tampering();

-- ============================================================================
-- MODULE 6: PRESCRIPTIONS & PHARMACY FULFILLMENT
-- ============================================================================

CREATE TABLE medicines (
    id VARCHAR(64) PRIMARY KEY,
    generic_name VARCHAR(255) NOT NULL,
    strength VARCHAR(64) NOT NULL,
    dosage_form VARCHAR(64) NOT NULL,
    therapeutic_category VARCHAR(128) NOT NULL,
    nlem_level VARCHAR(32) NOT NULL
);
COMMENT ON TABLE medicines IS 'National List of Essential Medicines (NLEM) reference catalog.';

CREATE INDEX idx_medicines_generic_name ON medicines(generic_name);

CREATE TABLE prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    record_id VARCHAR(64) UNIQUE NOT NULL REFERENCES medical_records(id) ON DELETE RESTRICT,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispensed', 'partially_dispensed', 'cancelled')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dispensed_at TIMESTAMPTZ
);
COMMENT ON TABLE prescriptions IS 'Prescription headers issued during clinical encounters.';

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_facility_status ON prescriptions(facility_id, status);

CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id VARCHAR(64) NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id VARCHAR(64) NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    dosage VARCHAR(64) NOT NULL,
    frequency VARCHAR(64) NOT NULL,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    instructions TEXT
);
COMMENT ON TABLE prescription_items IS 'Itemized medicines prescribed with dosage instructions.';

CREATE INDEX idx_prescription_items_rx ON prescription_items(prescription_id);

-- ============================================================================
-- MODULE 7: PATIENT CONSENT & EMERGENCY BREAK-GLASS ACCESS
-- ============================================================================

CREATE TABLE consent_grants (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    granted_to_user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    facility_id VARCHAR(64) REFERENCES facilities(id) ON DELETE CASCADE,
    purpose VARCHAR(64) NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT chk_consent_period CHECK (valid_until > valid_from)
);
COMMENT ON TABLE consent_grants IS 'Time-boxed patient consent records compliant with DPDP Act 2023.';

CREATE INDEX idx_consent_lookup ON consent_grants(patient_id, granted_to_user_id, revoked_at);

CREATE TABLE break_glass_accesses (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    accessed_by_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    mandatory_reason TEXT NOT NULL CHECK (length(mandatory_reason) >= 20),
    encounter_id VARCHAR(64),
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '4 hours'),
    notified_facility_admin BOOLEAN NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE break_glass_accesses IS 'Emergency clinical overrides bypassing consent for unconscious/critical patients.';

CREATE INDEX idx_break_glass_patient ON break_glass_accesses(patient_id);
CREATE INDEX idx_break_glass_facility ON break_glass_accesses(facility_id);

-- ============================================================================
-- MODULE 8: INVENTORY MANAGEMENT & AUDITABLE STOCK LEDGER
-- ============================================================================

CREATE TABLE inventory_items (
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    medicine_id VARCHAR(64) NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    current_quantity INT NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
    stock_status VARCHAR(16) NOT NULL DEFAULT 'available' CHECK (stock_status IN ('available', 'low', 'out')),
    last_idempotency_key VARCHAR(128) NOT NULL DEFAULT 'GENESIS',
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (facility_id, medicine_id)
);
COMMENT ON TABLE inventory_items IS 'Lockable projection row for current stock balance per facility and medicine.';

CREATE TABLE stock_ledger (
    id VARCHAR(64) PRIMARY KEY,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    medicine_id VARCHAR(64) NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    event_type VARCHAR(32) NOT NULL CHECK (event_type IN ('receipt', 'dispense', 'adjustment', 'expiry', 'transfer')),
    delta INT NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    recorded_by_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
COMMENT ON TABLE stock_ledger IS 'Append-only double-entry stock ledger for all inventory movements.';

CREATE INDEX idx_stock_ledger_facility ON stock_ledger(facility_id, recorded_at DESC);
CREATE INDEX idx_stock_ledger_medicine ON stock_ledger(medicine_id);

-- ============================================================================
-- MODULE 9: CITIZEN GRIEVANCE REDRESSAL (COMPLAINTS)
-- ============================================================================

CREATE TABLE complaints (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    category VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(32) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'escalated', 'resolved', 'closed')),
    description TEXT NOT NULL,
    sla_due_at DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE complaints IS 'Citizen grievance tracking with SLA deadlines.';

CREATE INDEX idx_complaints_facility_status ON complaints(facility_id, status);
CREATE INDEX idx_complaints_patient ON complaints(patient_id);

CREATE TABLE complaint_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    note TEXT NOT NULL,
    updated_by_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE complaint_updates IS 'Append-only resolution audit trail for grievances.';

CREATE INDEX idx_complaint_updates_cid ON complaint_updates(complaint_id);

-- ============================================================================
-- MODULE 10: INPATIENT BEDS & OPTIMISTIC CONCURRENCY
-- ============================================================================

CREATE TABLE beds (
    id VARCHAR(64) PRIMARY KEY,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    ward VARCHAR(64) NOT NULL,
    bed_number VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'cleaning', 'maintenance')),
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_facility_ward_bed UNIQUE (facility_id, ward, bed_number)
);
COMMENT ON TABLE beds IS 'Inpatient bed availability tracking with versioned optimistic concurrency.';

CREATE INDEX idx_beds_facility_status ON beds(facility_id, status);

-- ============================================================================
-- MODULE 11: TELECONSULT, DIAGNOSTICS & FOLLOW-UPS (DEFERRED SCHEMAS)
-- ============================================================================

CREATE TABLE teleconsult_sessions (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);
COMMENT ON TABLE teleconsult_sessions IS 'Scheduled video consultations via LiveKit rooms.';

CREATE TABLE diagnostic_orders (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    test_name VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'sample_collected', 'processing', 'reported')),
    ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE diagnostic_orders IS 'Laboratory test orders and tracking.';

CREATE TABLE follow_up_schedules (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    related_record_id VARCHAR(64) REFERENCES medical_records(id) ON DELETE RESTRICT,
    scheduled_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reminder_sent', 'completed', 'missed')),
    notes TEXT
);
COMMENT ON TABLE follow_up_schedules IS 'Post-consultation follow-up dates polled by queue workers via FOR UPDATE SKIP LOCKED.';

CREATE INDEX idx_followup_poll ON follow_up_schedules(scheduled_date, status);

-- ============================================================================
-- MODULE 12: TRANSACTIONAL OUTBOX & PROCESSED EVENTS
-- ============================================================================

CREATE TABLE outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(64) NOT NULL,
    topic VARCHAR(64) NOT NULL,
    partition_key VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    correlation_id VARCHAR(64) NOT NULL,
    causation_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    retry_count INT NOT NULL DEFAULT 0
);
COMMENT ON TABLE outbox IS 'Transactional outbox table guaranteeing atomic dual-writes with PostgreSQL transactions.';

CREATE INDEX idx_outbox_unprocessed ON outbox(created_at) WHERE published_at IS NULL;

CREATE TABLE processed_events (
    event_id UUID NOT NULL,
    consumer_group VARCHAR(64) NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (event_id, consumer_group)
);
COMMENT ON TABLE processed_events IS 'Deduplication table ensuring exactly-once processing for asynchronous event consumers.';

-- ============================================================================
-- MODULE 13: CRYPTOGRAPHICALLY HASH-CHAINED IMMUTABLE AUDIT LOG
-- ============================================================================

CREATE TABLE audit_log (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(64) NOT NULL,
    actor_user_id VARCHAR(64) NOT NULL,
    target_entity_type VARCHAR(64) NOT NULL,
    target_entity_id VARCHAR(64) NOT NULL,
    break_glass_reason TEXT,
    ip_address VARCHAR(45),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    prev_hash VARCHAR(64) NOT NULL,
    row_hash VARCHAR(64) NOT NULL
);
COMMENT ON TABLE audit_log IS 'Cryptographically hash-chained, tamper-evident audit log for DPDP Act 2023 compliance.';

CREATE INDEX idx_audit_target ON audit_log(target_entity_type, target_entity_id);
CREATE INDEX idx_audit_actor ON audit_log(actor_user_id);
CREATE INDEX idx_audit_occurred ON audit_log(occurred_at);

-- Trigger: Absolute prohibition of UPDATE or DELETE
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CANNOT_MODIFY_AUDIT_LOG: Audit log entries are strictly immutable by cryptographic design.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_tampering
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();

-- Stored Function: Cryptographic Chain Verification
CREATE OR REPLACE FUNCTION verify_audit_chain()
RETURNS TABLE (
    is_valid BOOLEAN,
    total_verified INT,
    broken_at_id VARCHAR(64),
    failure_reason TEXT
) AS $$
DECLARE
    r RECORD;
    expected_prev VARCHAR(64) := 'GENESIS';
    computed_hash VARCHAR(64);
    row_count INT := 0;
BEGIN
    FOR r IN SELECT * FROM audit_log ORDER BY occurred_at ASC, id ASC LOOP
        row_count := row_count + 1;
        
        -- Verify linkage to previous row
        IF r.prev_hash <> expected_prev THEN
            RETURN QUERY SELECT FALSE, row_count, r.id, 
                format('Hash chain broken. Expected prev_hash %s, got %s', expected_prev, r.prev_hash);
            RETURN;
        END IF;

        -- Compute row hash: SHA-256(prev_hash || id || action || actor_user_id || target_entity_type || target_entity_id || occurred_at)
        computed_hash := encode(digest(
            r.prev_hash || ':' || r.id || ':' || r.action || ':' || r.actor_user_id || ':' ||
            r.target_entity_type || ':' || r.target_entity_id || ':' || to_char(r.occurred_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
            'sha256'
        ), 'hex');

        IF r.row_hash <> computed_hash THEN
            RETURN QUERY SELECT FALSE, row_count, r.id,
                format('Corrupted row content. Expected row_hash %s, recorded %s', computed_hash, r.row_hash);
            RETURN;
        END IF;

        expected_prev := r.row_hash;
    END LOOP;

    RETURN QUERY SELECT TRUE, row_count, NULL::VARCHAR(64), 'All audit rows valid and verifiable.'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Enforce security roles: revoke any destructive commands from app_user
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
REVOKE UPDATE, DELETE ON audit_log FROM app_user;
REVOKE UPDATE, DELETE ON medical_records FROM app_user;
REVOKE UPDATE, DELETE ON stock_ledger FROM app_user;
