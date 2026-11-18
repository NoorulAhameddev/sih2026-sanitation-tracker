# Database Documentation

The project uses `SQLite` via a policy-safe adapter wrapping Node.js built-in `node:sqlite` (DatabaseSync), ensuring zero native `.node` DLL blocks under Windows Application Control policies.

## Schema setup
The database schema is defined in `server/database/schema.sql` and is executed automatically upon server startup if the file exists.

## Connection
The connection is established in `server/database/db.js`. The database path is configured via the `DB_PATH` environment variable. On graceful shutdown, the SQLite connection is safely closed to prevent corruption.
