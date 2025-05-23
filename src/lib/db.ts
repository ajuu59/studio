
// src/lib/db.ts
// REMOVED 'use server'; directive. This is now a regular server-side module.

import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import crypto from 'crypto';
import type { Post } from './types'; 

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

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Helper for slugification (kept internal or could be a shared util)
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

export async function getPostById(id: string): Promise<Post | null> {
  const db = await openDb();
  try {
    const post = await db.get<Post>(
      `SELECT id, title, slug, content, author, categoryName, tagsCsv, createdAt, updatedAt, scheduledAt 
       FROM posts 
       WHERE id = ?`,
      id
    );
    return post || null;
  } catch (error) {
    console.error(`Error fetching post by ID ${id}:`, error);
    throw error; // Re-throw to be handled by the caller
  } finally {
    await db.close();
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const db = await openDb();
  try {
    // It's important that the Post type returned by this matches what PostDisplay expects
    // Ensure all necessary fields (id, title, slug, content, author, createdAt, etc.) are selected
    const post = await db.get<Post>(
      `SELECT id, title, slug, content, author, categoryName, tagsCsv, createdAt, updatedAt, scheduledAt 
       FROM posts 
       WHERE slug = ?`,
      slug
    );
    return post || null;
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    throw error;
  } finally {
    await db.close();
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const db = await openDb();
  try {
    const posts = await db.all<Post[]>(
      `SELECT id, title, slug, content, author, categoryName, tagsCsv, createdAt, updatedAt, scheduledAt
       FROM posts
       ORDER BY createdAt DESC`
    );
    return posts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  } finally {
    await db.close();
  }
}

export interface PostUpdateDbInput {
  title: string;
  content: string;
  categoryName?: string;
  tagsCsv?: string;
  scheduledAt?: Date | null; // From form
}

export async function updatePost(id: string, postData: PostUpdateDbInput): Promise<{ success: boolean }> {
  const db = await openDb();
  const updatedAt = new Date().toISOString();
  const slug = slugify(postData.title); // Recalculate slug if title changes
  const scheduledAtISO = postData.scheduledAt instanceof Date ? postData.scheduledAt.toISOString() : null;


  try {
    const result = await db.run(
      `UPDATE posts
       SET title = ?, slug = ?, content = ?, categoryName = ?, tagsCsv = ?, updatedAt = ?, scheduledAt = ?
       WHERE id = ?`,
      postData.title,
      slug,
      postData.content,
      postData.categoryName || null,
      postData.tagsCsv || null,
      updatedAt,
      scheduledAtISO,
      id
    );

    if (result.changes === undefined || result.changes === 0) {
      const checkExists = await db.get('SELECT 1 FROM posts WHERE id = ?', id);
      if (!checkExists) {
        throw new Error("Post not found for update.");
      }
      console.log(`Post with ID: ${id} update attempted. No actual value changes or post not found if changes are 0.`);
    }
    console.log(`Post with ID: ${id} updated successfully.`);
    return { success: true };
  } catch (error) {
    console.error(`Error updating post with ID ${id} in DB:`, error);
    throw error; 
  } finally {
    await db.close();
  }
}
