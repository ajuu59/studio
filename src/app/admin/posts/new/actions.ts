
'use server';

import { addPost as dbAddPost, type NewPostDbInput, initializeDatabase as initDb } from '@/lib/db';

export async function createPostAction(
  formData: NewPostDbInput
): Promise<{ id: string } | { error: string; details?: any; hint?: string }> {
  try {
    // Here you could add more validation or pre-processing if needed
    const result = await dbAddPost(formData);
    return result; // e.g., { id: 'some-uuid' }
  } catch (error) {
    console.error("Error in createPostAction:", error);
    
    let errorMessage = "Failed to create post due to an unexpected error.";
    let errorDetails; // Keep undefined unless error is instance of Error
    let errorHint; // Initialize hint

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack; // Capture stack for server logs if needed
      if (error.message.toLowerCase().includes('no such table')) {
        errorHint = "The database table might not exist. Please ensure the database has been initialized.";
      }
    }
    
    return { 
      error: errorMessage,
      details: errorDetails, // Optional: for server logs, not necessarily for client display
      hint: errorHint // Pass hint to client
    };
  }
}

export async function runInitializeDatabaseAction(): Promise<{ success: boolean; message: string }> {
  try {
    await initDb();
    return { success: true, message: 'Database initialized successfully. Tables should now be created.' };
  } catch (error: any) {
    console.error("Error during manual database initialization action:", error);
    return { 
      success: false, 
      message: `Database initialization failed: ${error.message || 'Unknown error'}` 
    };
  }
}
