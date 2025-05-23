
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
  categoryName?: string; 
  tagsCsv?: string; 
  scheduledAt?: string; // Should be ISO8601 string

  // For compatibility with components that might expect these structures (like PostCard)
  // These are derived/transformed from categoryName and tagsCsv when needed.
  category?: Category; 
  tags?: Tag[];
}
