const request = require('supertest');
const app = require('../server');

describe('Waste Collection Worker Attendance & Route Register E2E Tests', () => {

  it('GET /health - should return 200 OK and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('GET /api/v1/attendance - should return list of records ordered by priority (uncovered first)', async () => {
    const res = await request(app).get('/api/v1/attendance');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    // Priority ordering check: Uncovered ('No') comes first
    const firstRecord = res.body.data[0];
    expect(firstRecord.covered).toBe('No');
  });

  it('GET /api/v1/attendance - should filter records by ward', async () => {
    const res = await request(app).get('/api/v1/attendance?ward=Ward-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.every(r => r.ward === 'Ward-1')).toBe(true);
  });

  it('GET /api/v1/attendance - should filter records by covered status', async () => {
    const res = await request(app).get('/api/v1/attendance?covered=No');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.every(r => r.covered === 'No')).toBe(true);
  });

  it('GET /api/v1/attendance - should search records by query string q', async () => {
    const res = await request(app).get('/api/v1/attendance?q=Ramesh');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.some(r => r.worker_name.includes('Ramesh'))).toBe(true);
  });

  it('POST /api/v1/attendance - should create a new route attendance record', async () => {
    const newRecord = {
      worker_id: 'WRK-E2E-999',
      worker_name: 'E2E Test Worker',
      route_id: 'RT-E2E-99',
      ward: 'Ward-10',
      covered: 'No',
      complaints_received: 5,
      date: '2026-07-25',
      remarks: 'E2E Test Entry'
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .send(newRecord);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.worker_id).toBe('WRK-E2E-999');
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/v1/attendance - should reject duplicate record with 409', async () => {
    const duplicateRecord = {
      worker_id: 'WRK-E2E-999',
      worker_name: 'E2E Test Worker',
      route_id: 'RT-E2E-99',
      ward: 'Ward-10',
      covered: 'No',
      complaints_received: 5,
      date: '2026-07-25',
      remarks: 'E2E Test Entry Duplicate'
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .send(duplicateRecord);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('DUPLICATE_RECORD');
  });

  it('POST /api/v1/attendance - should reject invalid data with 400 validation error', async () => {
    const invalidRecord = {
      worker_id: '',
      date: 'invalid-date'
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .send(invalidRecord);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/attendance/:id - should return single record by ID', async () => {
    const listRes = await request(app).get('/api/v1/attendance');
    const targetId = listRes.body.data[0].id;

    const res = await request(app).get(`/api/v1/attendance/${targetId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(targetId);
  });

  it('GET /api/v1/attendance/999999 - should return 404 for non-existent record', async () => {
    const res = await request(app).get('/api/v1/attendance/999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('PUT /api/v1/attendance/:id - should update an existing record', async () => {
    const listRes = await request(app).get('/api/v1/attendance');
    const targetRecord = listRes.body.data.find(r => r.worker_id === 'WRK-E2E-999');

    const updatePayload = {
      remarks: 'Updated by E2E suite',
      covered: 'Yes'
    };

    const res = await request(app)
      .put(`/api/v1/attendance/${targetRecord.id}`)
      .send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.remarks).toBe('Updated by E2E suite');
    expect(res.body.data.covered).toBe('Yes');
  });

  it('DELETE /api/v1/attendance/:id - should soft delete a record', async () => {
    const listRes = await request(app).get('/api/v1/attendance');
    const targetRecord = listRes.body.data.find(r => r.worker_id === 'WRK-E2E-999');

    const res = await request(app).delete(`/api/v1/attendance/${targetRecord.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const verifyRes = await request(app).get(`/api/v1/attendance/${targetRecord.id}`);
    expect(verifyRes.status).toBe(404);
  });

});
