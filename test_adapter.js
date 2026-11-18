const Database = require('./server/database/sqlite-adapter');
const assert = require('node:assert');

console.log("Testing SQLite Adapter with native node:sqlite...");

const db = new Database(':memory:');

// Test exec
db.exec(`
  CREATE TABLE test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER DEFAULT 0
  );
`);

// Test pragma
const cols = db.pragma('table_info(test)');
console.log("Pragma table_info columns:", cols.map(c => c.name));
assert(cols.some(c => c.name === 'name'));

// Test run with named parameters including extra ignored keys
const insert = db.prepare('INSERT INTO test (name, score) VALUES (@name, @score)');
const res1 = insert.run({ name: 'Alice', score: 100, extraIgnoredKey: 'foobar' });
console.log("Insert result:", res1);
assert.strictEqual(res1.lastInsertRowid, 1);

// Test get with positional param
const getStmt = db.prepare('SELECT * FROM test WHERE id = ?');
const row1 = getStmt.get(1);
console.log("Get row 1:", row1);
assert.strictEqual(row1.name, 'Alice');

// Test transaction
const insertTx = db.transaction((items) => {
  for (const item of items) {
    insert.run(item);
  }
});

insertTx([
  { name: 'Bob', score: 95 },
  { name: 'Charlie', score: 88 },
]);

const allStmt = db.prepare('SELECT * FROM test ORDER BY id ASC');
const allRows = allStmt.all();
console.log("All rows count:", allRows.length);
assert.strictEqual(allRows.length, 3);

db.close();
console.log("All SQLite adapter verification checks PASSED successfully!");
