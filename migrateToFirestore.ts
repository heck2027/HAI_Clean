// One-time migration: copies hai_database.json into Firestore (collection "resources").
// Safe to re-run: documents are keyed by record id, so it overwrites rather than duplicates.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=your-project-id STORAGE_BACKEND=firestore npx tsx scripts/migrateToFirestore.ts
// (locally you must first run: gcloud auth application-default login)
import fs from 'fs';
import path from 'path';
process.env.STORAGE_BACKEND = 'firestore';
const { store } = await import('../server/store.ts');

const file = path.join(process.cwd(), 'hai_database.json');
const records = JSON.parse(fs.readFileSync(file, 'utf-8'));
if (!Array.isArray(records)) throw new Error('hai_database.json is not an array');

await store.init();
await store.upsertMany(records);
console.log(`Migrated ${records.length} records to Firestore.`);
process.exit(0);
