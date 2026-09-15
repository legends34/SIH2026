#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Swasthya Concurrency Proof: Slot Overbooking Prevention
# Author: Lane D
# Description: Demonstrates that 20 concurrent transactions hitting a slot with
#              capacity 5 results in exactly 5 successes and 15 clean rejections
#              when protected by SELECT ... FOR UPDATE.
# ============================================================================

CONTAINER_NAME="swasthya-concurrency-test"
DB_USER="postgres"
DB_PASS="dev"
DB_PORT="54329"

echo "=== 1. Starting PostgreSQL 16 Test Container ==="
docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
docker run --rm -d \
  --name "${CONTAINER_NAME}" \
  -e POSTGRES_PASSWORD="${DB_PASS}" \
  -p "${DB_PORT}:5432" \
  pgvector/pgvector:pg16

echo "Waiting for database readiness..."
until docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" >/dev/null 2>&1; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

echo "=== 2. Applying Production DDL (schema.sql) ==="
docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -v ON_ERROR_STOP=1 < "$(dirname "$0")/../schema.sql"

echo "=== 3. Seeding Test Facility, Department, and Slot (Capacity = 5) ==="
docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" << 'SQL'
INSERT INTO facilities (id, name, tier, district, taluka, pincode, latitude, longitude, verified)
VALUES ('fac_test', 'Test PHC', 'phc', 'Gurugram', 'Gurugram', '122001', 28.4595, 77.0266, true);

INSERT INTO departments (code, name) VALUES ('GEN_MED', 'General Medicine');

INSERT INTO slots (id, facility_id, department_code, date, start_time, end_time, capacity, booked_count)
VALUES ('slot_test', 'fac_test', 'GEN_MED', CURRENT_DATE, '09:00:00', '13:00:00', 5, 0);

INSERT INTO users (id, phone, role) VALUES ('usr_dummy', '+919999999999', 'CITIZEN');

-- Seed 20 test patients
DO $$
BEGIN
  FOR i IN 1..20 LOOP
    INSERT INTO patients (id, user_id, full_name, date_of_birth, age_years, sex, preferred_language)
    VALUES ('pat_test_' || i, 'usr_dummy', 'Patient ' || i, '1990-01-01', 35, 'female', 'hi');
  END LOOP;
END
$$;
SQL

echo "=== 4. Firing 20 Concurrent Booking Transactions (Protected with FOR UPDATE) ==="
TMP_RESULTS="/tmp/booking_results_$$"
mkdir -p "${TMP_RESULTS}"

for i in $(seq 1 20); do
  (
    OUT=$(docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -v ON_ERROR_STOP=1 << SQL 2>&1
BEGIN;
SELECT id, booked_count, capacity FROM slots WHERE id = 'slot_test' FOR UPDATE;
DO \$\$
DECLARE
  v_booked INT;
  v_cap INT;
BEGIN
  SELECT booked_count, capacity INTO v_booked, v_cap FROM slots WHERE id = 'slot_test';
  IF v_booked >= v_cap THEN
    RAISE EXCEPTION 'SLOT_FULL';
  END IF;
  UPDATE slots SET booked_count = booked_count + 1 WHERE id = 'slot_test';
  INSERT INTO appointments (id, slot_id, patient_id, facility_id, department_code, token_number, status)
  VALUES ('appt_test_$i', 'slot_test', 'pat_test_$i', 'fac_test', 'GEN_MED', v_booked + 1, 'booked');
END
\$\$;
COMMIT;
SQL
    ) || true

    if echo "${OUT}" | grep -q "COMMIT"; then
      echo "SUCCESS" > "${TMP_RESULTS}/res_${i}.txt"
    else
      echo "CONFLICT_SLOT_FULL" > "${TMP_RESULTS}/res_${i}.txt"
    fi
  ) &
done

wait

SUCCESS_COUNT=$(grep -c "SUCCESS" "${TMP_RESULTS}"/*.txt || true)
CONFLICT_COUNT=$(grep -c "CONFLICT_SLOT_FULL" "${TMP_RESULTS}"/*.txt || true)
FINAL_BOOKED=$(docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -tAc "SELECT booked_count FROM slots WHERE id = 'slot_test';")

echo "---------------------------------------------------------"
echo "Concurrency Test Results (Protected by Row Locks):"
echo "  Total Requests Dispatched: 20"
echo "  Successful Bookings:       ${SUCCESS_COUNT} (Expected: 5)"
echo "  Rejected (Slot Full):      ${CONFLICT_COUNT} (Expected: 15)"
echo "  Final Database Counter:    ${FINAL_BOOKED} (Expected: 5)"
echo "---------------------------------------------------------"

rm -rf "${TMP_RESULTS}"
docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true

if [ "${SUCCESS_COUNT}" -eq 5 ] && [ "${FINAL_BOOKED}" -eq 5 ]; then
  echo "VERIFICATION PASSED: Perfect concurrency protection proven."
  exit 0
else
  echo "VERIFICATION FAILED: Overbooking or inconsistency detected."
  exit 1
fi
