
'use server';
import { getAllPosts as dbGetAllPosts } from '@/lib/db';
import type { Post as DbPost, Post, Category, Tag } from '@/lib/types'; // Using DbPost alias for clarity
import { useToast } from "@/hooks/use-toast"; // Not used here, can be removed unless other actions need it

// Helper function to transform DbPost to the Post type expected by components
// This can be centralized if used in multiple places.
function transformDbPostToAppPost(dbPost: DbPost): Post {
  const category: Category | undefined = dbPost.categoryName
    ? { id: dbPost.categoryName, name: dbPost.categoryName }
    : undefined;

  const tags: Tag[] = dbPost.tagsCsv
    ? dbPost.tagsCsv.split(',').map(tagName => ({ id: tagName.trim(), name: tagName.trim() }))
    : [];
  
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content,
    author: dbPost.author,
    createdAt: dbPost.createdAt,
    updatedAt: dbPost.updatedAt,
    category: category, 
    tags: tags,
    categoryName: dbPost.categoryName,
    tagsCsv: dbPost.tagsCsv,
    scheduledAt: dbPost.scheduledAt,
  };
}


export async function loadMorePostsAction(offset: number, limit: number): Promise<Post[]> {
  try {
    const dbPosts = await dbGetAllPosts({ limit, offset });
    return dbPosts.map(transformDbPostToAppPost);
  } catch (error) {
    console.error("Error in loadMorePostsAction:", error);
    // In a real app, you might want to return an object like { error: "message" }
    // For now, re-throwing or returning empty array might be options.
    // Returning empty array to prevent breaking client if it expects Post[]
    return []; 
  }
}
