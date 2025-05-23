
// src/lib/db.ts
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';

// Define the database file path. It will be created in the project root.
const DB_FILE_NAME = 'content.db';
const DB_PATH = path.join(process.cwd(), DB_FILE_NAME);

// Function to open the database connection
// It's often better to manage a single connection instance or a small pool,
// but for simplicity in this initial setup, we'll open a new connection.
export async function openDb(): Promise<Database> {
  return open({
    filename: DB_PATH,
    driver: sqlite3.verbose().Database, // Using verbose for more detailed error logs during development
  });
}

export async function initializeDatabase(): Promise<void> {
  console.log(`Initializing database at: ${DB_PATH}`);
  const db = await openDb();

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        categoryName TEXT,      -- Store category name directly
        tagsCsv TEXT,           -- Store tags as a comma-separated string
        createdAt TEXT NOT NULL,  -- ISO8601 date string
        updatedAt TEXT,         -- ISO8601 date string
        scheduledAt TEXT        -- ISO8601 date string
      );
    `);
    console.log('Table "posts" created or already exists.');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        postId TEXT NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL, -- ISO8601 date string
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);
    console.log('Table "comments" created or already exists.');

    console.log('Database initialized successfully.');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw to indicate failure
  } finally {
    await db.close();
  }
}

// Example of how you might run this initialization (e.g., in a separate script):
//
// import { initializeDatabase } from './lib/db';
// initializeDatabase().catch(err => {
//   console.error("Failed to initialize database:", err);
//   process.exit(1);
// });
//
// You would run this script using: node your-init-script.js
// Or integrate this call into your application's startup if appropriate for your deployment.
// For Next.js, this might be part of a build step or a one-time manual execution.

// Future data access functions (getAllPosts, addPost, etc.) will go here.
