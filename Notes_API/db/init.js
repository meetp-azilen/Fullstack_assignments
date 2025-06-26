const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(process.env.DB_PATH);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
    db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    content TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

module.exports = db;
