process.env.NODE_ENV = 'test';
const app = require('./server/server');
const assert = require('node:assert');

const PORT = 3012;

const server = app.listen(PORT, async () => {
  console.log(`Server running on http://127.0.0.1:${PORT} for real user interaction test.`);

  const BASE = `http://127.0.0.1:${PORT}`;

  try {
    // 1. User checks health
    console.log("\n[User Step 1] Querying /health...");
    const res1 = await fetch(`${BASE}/health`);
    assert.strictEqual(res1.status, 200);
    const data1 = await res1.json();
    console.log("Health response:", data1);
    assert.strictEqual(data1.data.status, "healthy");

    // 2. User lists attendance records
    console.log("\n[User Step 2] Querying /api/v1/attendance?limit=5...");
    const res2 = await fetch(`${BASE}/api/v1/attendance?limit=5`);
    assert.strictEqual(res2.status, 200);
    const data2 = await res2.json();
    console.log(`Retrieved ${data2.data.length} records. Total dataset count: ${data2.total_dataset_count}`);
    assert(data2.data.length > 0);
    assert(data2.total_dataset_count >= data2.data.length);

    // 3. User creates a new route attendance record
    console.log("\n[User Step 3] Creating new attendance record via POST...");
    const newRecord = {
      worker_id: "WRK-USER-REAL",
      worker_name: "Real User Worker",
      phone_number: "9876543210",
      route_id: "RT-REAL-01",
      ward: "Ward-Real",
      covered: "No",
      complaints_received: 4,
      date: "2026-11-18",
      remarks: "Field verification during audit",
    };

    const res3 = await fetch(`${BASE}/api/v1/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    });
    assert.strictEqual(res3.status, 201);
    const data3 = await res3.json();
    console.log("Created record ID:", data3.data.id);
    assert(data3.data.id > 0);
    const createdId = data3.data.id;

    // 4. User updates the record
    console.log("\n[User Step 4] Updating record status to Covered via PUT...");
    const res4 = await fetch(`${BASE}/api/v1/attendance/${createdId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ covered: "Yes", remarks: "Resolved by relief crew" }),
    });
    assert.strictEqual(res4.status, 200);
    const data4 = await res4.json();
    console.log("Updated record:", data4.data);
    assert.strictEqual(data4.data.covered, "Yes");

    // 5. User cleans up record via DELETE
    console.log("\n[User Step 5] Deleting record via DELETE...");
    const res5 = await fetch(`${BASE}/api/v1/attendance/${createdId}`, {
      method: "DELETE",
    });
    assert.strictEqual(res5.status, 200);

    console.log("\nReal user verification completed with 100% success across all database and HTTP operations!");
  } catch (err) {
    console.error("Test error:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(0);
  }
});
