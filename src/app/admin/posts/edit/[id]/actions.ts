
'use server';

import { getPostById as dbGetPostById, updatePost as dbUpdatePost, type PostUpdateDbInput } from '@/lib/db';
import type { Post } from '@/lib/types';
import type { PostFormValues } from '@/components/blog/PostForm';

export async function getPostForEditAction(id: string): Promise<PostFormValues | { error: string; details?: any }> {
  try {
    const post = await dbGetPostById(id);
    if (!post) {
      return { error: "Post not found." };
    }
    // Transform Post from DB to PostFormValues
    return {
      title: post.title,
      content: post.content,
      category: post.categoryName, // Optional string, directly assignable
      tags: post.tagsCsv,       // Optional string, directly assignable
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
    };
  } catch (error) {
    console.error("Error in getPostForEditAction:", error);
    let errorMessage = "Failed to fetch post due to an unexpected error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage, details: error instanceof Error ? error.stack : undefined };
  }
}

export async function updatePostAction(
  id: string,
  formData: PostFormValues
): Promise<{ success: boolean } | { error: string; details?: any }> {
  try {
    const postData: PostUpdateDbInput = {
      title: formData.title,
      content: formData.content,
      categoryName: formData.category,
      tagsCsv: formData.tags,
      scheduledAt: formData.scheduledAt, 
    };
    await dbUpdatePost(id, postData);
    return { success: true };
  } catch (error) {
    console.error("Error in updatePostAction:", error);
    let errorMessage = "Failed to update post due to an unexpected error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage, details: error instanceof Error ? error.stack : undefined };
  }
}
