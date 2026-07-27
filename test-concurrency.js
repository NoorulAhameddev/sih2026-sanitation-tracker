/**
 * ============================================================
 * SIH 2026 — Level 2 — Change 2 — Concurrency Safety Test
 * ============================================================
 *
 * This script demonstrates that the save action is now safe
 * when two people do it at the same time.
 *
 * HOW IT WORKS:
 *   1. Sends TWO IDENTICAL POST requests simultaneously
 *      using Promise.all (both fire at the same instant).
 *   2. The UNIQUE database index on (worker_id, route_id, date)
 *      ensures that only ONE insert succeeds.
 *   3. The other request is politely refused with HTTP 409.
 *
 * HOW TO RUN:
 *   1. Start the backend server: npm run dev
 *   2. In another terminal: node test-concurrency.js
 *
 * EXPECTED OUTPUT:
 *   Request A → 201 Created  (one succeeds)
 *   Request B → 409 Conflict (the other is refused)
 * ============================================================
 */

const BASE_URL = 'http://localhost:3000/api/v1/attendance';

// A unique test payload — uses a future-safe worker ID to avoid conflicts with seed data
const testPayload = {
  worker_id: 'WRK-RACE-TEST',
  worker_name: 'Concurrency Test Worker',
  phone_number: '9999999999',
  route_id: 'RT-RACE',
  ward: 'Ward-RACE',
  covered: 'Yes',
  complaints_received: 0,
  date: '2026-01-01',   // A date that won't conflict with seed data
  remarks: 'Concurrency race condition test'
};

async function sendRequest(label) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });
    const data = await response.json();
    return { label, status: response.status, data };
  } catch (err) {
    return { label, status: 'NETWORK_ERROR', error: err.message };
  }
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  SIH 2026 — Change 2 — Concurrency Safety Test         ║');
  console.log('║  Sending TWO identical requests simultaneously...       ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  console.log('');
  console.log('Firing both requests at the EXACT same time...');
  console.log('');

  // Fire both requests simultaneously — this is the race condition test
  const [resultA, resultB] = await Promise.all([
    sendRequest('Request A'),
    sendRequest('Request B'),
  ]);

  // Display results
  console.log('┌──────────────────────────────────────────────────────────┐');
  console.log(`│  ${resultA.label}  →  HTTP ${resultA.status}  ${resultA.status === 201 ? '✅ CREATED (Success)' : resultA.status === 409 ? '🚫 CONFLICT (Refused)' : '⚠️ UNEXPECTED'}`);
  console.log(`│  ${resultB.label}  →  HTTP ${resultB.status}  ${resultB.status === 201 ? '✅ CREATED (Success)' : resultB.status === 409 ? '🚫 CONFLICT (Refused)' : '⚠️ UNEXPECTED'}`);
  console.log('└──────────────────────────────────────────────────────────┘');
  console.log('');

  // Verdict
  const statuses = [resultA.status, resultB.status].sort();
  if (statuses[0] === 201 && statuses[1] === 409) {
    console.log('✅ PASS — Exactly ONE succeeded (201), the other was politely refused (409).');
    console.log('   Concurrency safety is WORKING correctly.');
  } else if (statuses[0] === 201 && statuses[1] === 201) {
    console.log('❌ FAIL — BOTH requests succeeded! Concurrency protection is NOT working.');
  } else if (statuses[0] === 409 && statuses[1] === 409) {
    console.log('⚠️  Both were refused (409). The record may already exist from a previous test run.');
    console.log('   Delete the test record and try again, or check the database.');
  } else {
    console.log('⚠️  Unexpected result. Check the server logs.');
  }

  console.log('');
  console.log('Response details:');
  console.log(`  ${resultA.label}:`, JSON.stringify(resultA.data, null, 2));
  console.log(`  ${resultB.label}:`, JSON.stringify(resultB.data, null, 2));
}

main();
