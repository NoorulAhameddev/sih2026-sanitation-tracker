const request = require('supertest');
const app = require('../../server');

describe('Attendance API Integration', () => {
    let createdId;

    it('should create a new route attendance record (POST /api/v1/attendance)', async () => {
        const response = await request(app)
            .post('/api/v1/attendance')
            .send({
                worker_id: "WRK-INT-100",
                worker_name: "Integration Worker",
                route_id: "RT-INT-01",
                ward: "Ward-1",
                covered: "Yes",
                complaints_received: 0,
                date: "2025-01-01",
                remarks: "Integration Test"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        createdId = response.body.data.id;
    });

    it('should return validation error for missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/attendance')
            .send({
                worker_id: "WRK-INT-100"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should retrieve attendance records with pagination (GET /api/v1/attendance)', async () => {
        const response = await request(app)
            .get('/api/v1/attendance?limit=1&offset=0')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should update an attendance record (PUT /api/v1/attendance/:id)', async () => {
        const response = await request(app)
            .put(`/api/v1/attendance/${createdId}`)
            .send({
                covered: "No",
                complaints_received: 2
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.covered).toBe("No");
    });

    it('should soft delete an attendance record (DELETE /api/v1/attendance/:id)', async () => {
        const response = await request(app)
            .delete(`/api/v1/attendance/${createdId}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const getResponse = await request(app)
            .get(`/api/v1/attendance/${createdId}`)
            .send();
            
        expect(getResponse.status).toBe(404);
    });
});
