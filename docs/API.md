# API Documentation

## Versioning
All APIs are versioned. Current version is `v1`.
Base URL: `/api/v1`

## Endpoints

### Health Check
- **URL:** `/api/v1/health`
- **Method:** `GET`
- **Description:** Returns the application and database health status, along with uptime.

### Attendance
- **URL:** `/api/v1/attendance`
- **Methods:** `GET`, `POST`
- **Description:** Fetch all attendance records or create a new one.

- **URL:** `/api/v1/attendance/:id`
- **Methods:** `GET`, `PUT`, `DELETE`
- **Description:** Retrieve, update, or delete a specific attendance record by ID.
