const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// 1. Connect to PostgreSQL
const pg = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres', logging: false });

// 2. Connect to SQLite
const dbPath = path.join(__dirname, '..', 'Data', 'hardware_store.sqlite');
const lite = new Sequelize({ dialect: 'sqlite', storage: dbPath, logging: false });

const tables = ['units', 'settings', 'suppliers', 'customers', 'products']; 

async function migrate() {
    try {
        await pg.authenticate();
        await lite.authenticate();
        console.log('✅ Connected to both databases.');

        await lite.query('PRAGMA foreign_keys = OFF;');

        for (const table of tables) {
            console.log(`⏳ Migrating ${table}...`);
            
            // Fetch data from Postgres
            const rows = await pg.query(`SELECT * FROM "${table}"`, { type: Sequelize.QueryTypes.SELECT });
            
            if (rows.length === 0) {
                console.log(`   - 0 rows found. Skipping.`);
                continue;
            }

            // Clean the data: Fix lowercase column names and null values
            const cleanRows = rows.map(row => {
                const newRow = {};
                for (const [key, value] of Object.entries(row)) {
                    // Replace undefined with null so Sequelize handles it properly
                    newRow[key] = value === undefined ? null : value;
                }
                return newRow;
            });

            // Clear existing data in SQLite to prevent duplicates
            await lite.query(`DELETE FROM "${table}"`);

            // Insert using Sequelize's built-in bulkInsert (Much safer!)
            try {
                await lite.getQueryInterface().bulkInsert(table, cleanRows);
                console.log(`   - ✅ ${rows.length} rows copied.`);
            } catch (insertErr) {
                console.error(`   - ❌ Failed on table ${table}. Error: ${insertErr.message}`);
                console.log(`   - Debug first row:`, cleanRows[0]);
                throw insertErr; 
            }
        }

        await lite.query('PRAGMA foreign_keys = ON;');
        console.log('🎉 Data migration complete!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();