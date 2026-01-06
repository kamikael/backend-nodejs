import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const adapterModule = require('@prisma/adapter-better-sqlite3');
console.log('Adapter Module:', adapterModule);
console.log('Keys:', Object.keys(adapterModule));
