import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

console.log('Initializing Database...');
const db = new Database('test.db');
console.log('Database initialized.', Object.keys(db), db.name);


console.log('Initializing Adapter...');
const adapter = new PrismaBetterSqlite3(db);
console.log('Adapter initialized.');

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('Connected successfully!');
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error('Connection failed:');
    console.error(e);
});
