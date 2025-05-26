
'use server';
import { getAllPosts as dbGetAllPosts, deletePostById as dbDeletePostById } from '@/lib/db';
import type { Post } from '@/lib/types';

export async function getPostsForAdminAction(): Promise<Post[] | { error: string }> {
  try {
    const posts = await dbGetAllPosts();
    return posts;
  } catch (error) {
    console.error("Error in getPostsForAdminAction:", error);
    let errorMessage = "Failed to fetch posts.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}

export async function deletePostAction(postId: string): Promise<{ success: boolean } | { error: string }> {
  try {
    await dbDeletePostById(postId);
    return { success: true };
  } catch (error) {
    console.error("Error in deletePostAction:", error);
    let errorMessage = "Failed to delete post.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
