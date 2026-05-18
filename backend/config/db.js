const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbPromise;

async function getDbConnection() {
  if (!dbPromise) {
    dbPromise = open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    }).then(async (db) => {
      console.log('Connected to SQLite database.');
      // Initialize tables
      await db.exec(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            due_date TEXT NOT NULL,
            status TEXT DEFAULT 'unpaid',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

// Wrapper to mimic mysql2's execute behavior
const db = {
  execute: async (query, params = []) => {
    const connection = await getDbConnection();
    
    // SQLite uses slightly different syntax for query vs run. 
    // SELECT should be 'all', INSERT/UPDATE/DELETE should be 'run'.
    const isSelect = query.trim().toUpperCase().startsWith('SELECT');
    
    if (isSelect) {
      const rows = await connection.all(query, params);
      return [rows]; // mimicking mysql2 [rows, fields]
    } else {
      const result = await connection.run(query, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  }
};

module.exports = db;
