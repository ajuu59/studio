
// src/lib/db.ts
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import crypto from 'crypto';
import type { Post } from './types'; // Ensure Post type is available if needed for return types, though not directly for input here

// Define the database file path. It will be created in the project root.
const DB_FILE_NAME = 'content.db';
const DB_PATH = path.join(process.cwd(), DB_FILE_NAME);

// Function to open the database connection
export async function openDb(): Promise<Database> {
  return open({
    filename: DB_PATH,
    driver: sqlite3.verbose().Database,
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
        categoryName TEXT,
        tagsCsv TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT,
        scheduledAt TEXT
      );
    `);
    console.log('Table "posts" created or already exists.');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        postId TEXT NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);
    console.log('Table "comments" created or already exists.');

    console.log('Database initialized successfully.');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Helper for slugification
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-');          // Replace multiple - with single -
}

export interface NewPostDbInput {
  title: string;
  content: string;
  author: string;
  categoryName?: string;
  tagsCsv?: string;
  scheduledAt?: Date; // From form, will be converted to ISO string for DB
}

export async function addPost(postData: NewPostDbInput): Promise<{ id: string }> {
  const db = await openDb();
  const id = crypto.randomUUID();
  const slug = slugify(postData.title);
  const createdAt = new Date().toISOString();
  const scheduledAtISO = postData.scheduledAt ? postData.scheduledAt.toISOString() : null;

  try {
    const result = await db.run(
      `INSERT INTO posts (id, title, slug, content, author, categoryName, tagsCsv, createdAt, scheduledAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      postData.title,
      slug,
      postData.content,
      postData.author,
      postData.categoryName || null,
      postData.tagsCsv || null,
      createdAt,
      scheduledAtISO
    );

    if (result.changes === undefined || result.changes === 0) {
      throw new Error("Post creation failed, database operation reported no changes.");
    }
    console.log(`Post created with ID: ${id}, Slug: ${slug}`);
    return { id };
  } catch (error) {
    console.error('Error adding post to DB:', error);
    throw error;
  } finally {
    await db.close();
  }
}
