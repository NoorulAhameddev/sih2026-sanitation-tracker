# Database Documentation

The project uses `SQLite` with the `better-sqlite3` driver.

## Schema setup
The database schema is defined in `server/database/schema.sql` and is executed automatically upon server startup if the file exists.

## Connection
The connection is established in `server/database/db.js`. The database path is configured via the `DB_PATH` environment variable. On graceful shutdown, the SQLite connection is safely closed to prevent corruption.
