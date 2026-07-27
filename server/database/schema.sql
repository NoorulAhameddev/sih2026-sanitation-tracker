CREATE TABLE IF NOT EXISTS attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    phone_number TEXT DEFAULT '',
    route_id TEXT NOT NULL,
    ward TEXT NOT NULL,
    covered TEXT NOT NULL CHECK(covered IN ('Yes', 'No')),
    complaints_received INTEGER NOT NULL DEFAULT 0,
    priority_score INTEGER NOT NULL DEFAULT 0,
    remarks TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_worker ON attendance_records(worker_id);
CREATE INDEX IF NOT EXISTS idx_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_route ON attendance_records(route_id);
CREATE INDEX IF NOT EXISTS idx_ward ON attendance_records(ward);
CREATE INDEX IF NOT EXISTS idx_priority ON attendance_records(priority_score);

-- Concurrency Safety: Prevent duplicate (worker_id, route_id, date) for active records
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_worker_route_date
    ON attendance_records(worker_id, route_id, date)
    WHERE deleted_at IS NULL;
