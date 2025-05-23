
'use server';

import { addPost as dbAddPost, type NewPostDbInput } from '@/lib/db';

export async function createPostAction(
  formData: NewPostDbInput
): Promise<{ id: string } | { error: string; details?: any }> {
  try {
    // Here you could add more validation or pre-processing if needed
    const result = await dbAddPost(formData);
    return result; // e.g., { id: 'some-uuid' }
  } catch (error) {
    console.error("Error in createPostAction:", error);
    // It's good practice to not expose raw error details to the client
    // unless they are safe and intended for display.
    // For now, we'll return a generic message or the error message if it's an Error instance.
    return { 
      error: error instanceof Error ? error.message : "Failed to create post due to an unexpected error.",
      details: error instanceof Error ? error.stack : undefined // Optional: for server logs, not for client display
    };
  }
}
