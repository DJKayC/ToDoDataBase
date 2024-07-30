const Database = require('better-sqlite3');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = process.env.DB_PATH || './src/database/data.db';
const db = new Database(dbPath);

const initializeDatabase = () => {
    console.log('Initializing DB');
    try {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS todos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                completed TEXT NOT NULL
            )
        `).run();
        console.log('Table is prepared.');

        const verifyQuery = db.prepare(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='todos'
        `);
        const tableExist = verifyQuery.get();
        if (tableExist) {
            console.log('Table todos exists');
        } else {
            console.log('Table does not exist');
        }
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

module.exports = {
    initializeDatabase,
    db
}
