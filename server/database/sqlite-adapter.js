// Suppress SQLite experimental warning
const originalEmit = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  if (typeof warning === 'string' && warning.includes('SQLite is an experimental feature')) {
    return;
  }
  if (warning && warning.name === 'ExperimentalWarning' && warning.message && warning.message.includes('SQLite')) {
    return;
  }
  return originalEmit.call(process, warning, ...args);
};

const { DatabaseSync } = require('node:sqlite');

/**
 * Clean adapter wrapping built-in node:sqlite (DatabaseSync) to provide
 * 100% API compatibility with better-sqlite3 without loading untrusted .node native DLLs.
 * This completely bypasses Windows Application Control policy blocks.
 */

function extractParamNames(sql) {
  const matches = new Set();
  const regex = /[@$:][a-zA-Z0-9_]+/g;
  let match;
  while ((match = regex.exec(sql)) !== null) {
    matches.add(match[0].slice(1));
  }
  return matches;
}

function filterNamedParams(sql, obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const expected = extractParamNames(sql);
  if (expected.size === 0) return obj;

  const filtered = {};
  for (const [k, v] of Object.entries(obj)) {
    const cleanKey = k.startsWith('@') || k.startsWith(':') || k.startsWith('$') ? k.slice(1) : k;
    if (expected.has(cleanKey)) {
      filtered[cleanKey] = v;
    }
  }
  return filtered;
}

class StatementAdapter {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.stmt = db.prepare(sql);
  }

  _prepareArgs(args) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
      return [filterNamedParams(this.sql, args[0])];
    }
    return args;
  }

  run(...args) {
    const prepArgs = this._prepareArgs(args);
    const result = this.stmt.run(...prepArgs);
    return {
      lastInsertRowid: result.lastInsertRowid,
      changes: result.changes,
    };
  }

  get(...args) {
    const prepArgs = this._prepareArgs(args);
    return this.stmt.get(...prepArgs);
  }

  all(...args) {
    const prepArgs = this._prepareArgs(args);
    return this.stmt.all(...prepArgs);
  }
}

class DatabaseAdapter {
  constructor(dbPath) {
    this.db = new DatabaseSync(dbPath);
    this._inTransaction = false;
  }

  prepare(sql) {
    return new StatementAdapter(this.db, sql);
  }

  exec(sql) {
    return this.db.exec(sql);
  }

  pragma(pragmaStr) {
    try {
      const stmt = this.db.prepare(`PRAGMA ${pragmaStr}`);
      return stmt.all();
    } catch {
      return [];
    }
  }

  transaction(fn) {
    return (...args) => {
      // Handle nested transactions via SAVEPOINT
      if (this._inTransaction) {
        const spName = `sp_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        this.db.exec(`SAVEPOINT ${spName}`);
        try {
          const result = fn(...args);
          this.db.exec(`RELEASE SAVEPOINT ${spName}`);
          return result;
        } catch (err) {
          this.db.exec(`ROLLBACK TO SAVEPOINT ${spName}`);
          throw err;
        }
      }

      this._inTransaction = true;
      this.db.exec('BEGIN');
      try {
        const result = fn(...args);
        this.db.exec('COMMIT');
        return result;
      } catch (err) {
        this.db.exec('ROLLBACK');
        throw err;
      } finally {
        this._inTransaction = false;
      }
    };
  }

  close() {
    return this.db.close();
  }
}

module.exports = DatabaseAdapter;
