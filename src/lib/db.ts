
// src/lib/db.ts
// REMOVED 'use server'; directive. This is now a regular server-side module.

import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import crypto from 'crypto';
// Post type might be used if addPost returned the full post, but currently it returns {id}.
// import type { Post } from './types'; 

// Define the database file path. It will be created in the project root.
const DB_FILE_NAME = 'content.db';
const DB_PATH = path.join(process.cwd(), DB_FILE_NAME);

// Function to open the database connection (kept internal)
async function openDb(): Promise<Database> {
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

  } catch (error) { // Added missing opening brace here
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Helper for slugification (kept internal to addPost or could be a shared util)
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
  const slug = slugify(postData.title); // Use internal slugify
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

