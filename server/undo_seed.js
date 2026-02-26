const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');

/**
 * Undo seeding helper
 * Usage:
 *  node undo_seed.js            # removes `users` and `menus` collections if present
 *  node undo_seed.js --drop-db  # drops the entire database (IRREVERSIBLE)
 */

async function undo({ dropEntireDB = false } = {}) {
  try {
    await connectDB();

    if (dropEntireDB) {
      // Drop the whole database
      await mongoose.connection.db.dropDatabase();
      console.log('Dropped entire database (irreversible)');
      process.exit(0);
    }

    // Otherwise remove only the seeded collections
    const collectionsToRemove = ['users', 'menus'];

    for (const name of collectionsToRemove) {
      const exists = await mongoose.connection.db.listCollections({ name }).hasNext();
      if (exists) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Dropped collection: ${name}`);
      } else {
        console.log(`Collection not found, skipping: ${name}`);
      }
    }

    console.log('Selected seeded data removed');
    process.exit(0);
  } catch (err) {
    console.error('Undo failed:', err);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const drop = args.includes('--drop-db') || args.includes('-d');
undo({ dropEntireDB: drop });
