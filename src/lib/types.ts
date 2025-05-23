
export type UserRole = 'Admin' | 'Editor' | 'Contributor' | 'Guest';

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string; // Should be ISO8601 string
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: string; // Should be ISO8601 string
  updatedAt?: string; // Should be ISO8601 string
  categoryName?: string; // Changed from Category object
  tagsCsv?: string; // Changed from Tag[] - will store as comma-separated string
  scheduledAt?: string; // Should be ISO8601 string
}

