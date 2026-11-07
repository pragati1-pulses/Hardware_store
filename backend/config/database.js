const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const isPkg = typeof process.pkg !== 'undefined';
const dialect = process.env.DB_DIALECT || (isPkg ? 'sqlite' : 'postgres');

let sequelize;

if (dialect === 'sqlite') {
    const appDir = isPkg ? path.dirname(process.execPath) : path.join(__dirname, '..');
    const dataDir = path.join(appDir, 'Data');
    
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'hardware_store.sqlite');

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false,
        // 👇 ADD THIS: Force Sequelize to use ONLY ONE connection
        pool: {
            max: 1,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    (async () => {
        try {
            await sequelize.query('PRAGMA journal_mode = WAL;');
            await sequelize.query('PRAGMA synchronous = NORMAL;');
            // 👇 REMOVED the EXCLUSIVE lock. WAL mode is safe enough.
            await sequelize.query('PRAGMA mmap_size = 0;');
            await sequelize.query('PRAGMA foreign_keys = ON;');
            console.log('[DB] SQLite mode →', dbPath);
        } catch (err) {
            console.error('[DB] PRAGMA setup failed:', err);
        }
    })();
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
    });
    console.log('[DB] PostgreSQL mode');
}

module.exports = sequelize;