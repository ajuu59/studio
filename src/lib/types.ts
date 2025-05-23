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
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  imageHint?: string;
  category?: Category;
  tags?: Tag[];
  scheduledAt?: string;
}
