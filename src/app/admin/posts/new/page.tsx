
"use client";

import { PostForm } from "@/components/blog/PostForm";
import type { PostFormValues } from "@/components/blog/PostForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createPostAction } from './actions'; // Import the server action
import type { NewPostDbInput } from '@/lib/db'; // Import the type from db.ts or actions.ts if re-exported
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function NewPostPage() {
  const { isAuthenticated, userRole } = useAuth();
  const { toast } = useToast(); // Initialize toast
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreatePost = async (formData: PostFormValues) => {
    if (!userRole || userRole === 'Guest') {
        console.error("Cannot create post: User is not authenticated or is a Guest.");
        toast({ // Use toast for user feedback
          title: "Authorization Error",
          description: "User not authorized to create posts.",
          variant: "destructive",
        });
        // Throw an error to be caught by PostForm's generic error handler,
        // or handle it more gracefully if PostForm doesn't re-throw.
        throw new Error("User not authorized to create posts."); 
    }
    setIsSubmitting(true);
    try {
      const postData: NewPostDbInput = {
        title: formData.title,
        content: formData.content,
        author: userRole, 
        categoryName: formData.category,
        tagsCsv: formData.tags,
        scheduledAt: formData.scheduledAt,
      };
      
      const result = await createPostAction(postData);

      if ('error' in result) {
        console.error("Failed to create post:", result.error, result.details);
        // This error will be caught by PostForm's catch block if it re-throws
        // or if PostForm's onSubmitForm expects a promise that can reject.
        // We are throwing here so PostForm can show its own error toast.
        throw new Error(result.error || "An unknown error occurred while creating the post.");
      }
      
      // Success is handled by PostForm's onSubmitForm resolving successfully
      console.log("Post created successfully with ID:", result.id);
      // The PostForm should show its own success toast if onSubmitForm resolves.

    } catch (error) {
      console.error("Error during post creation process:", error);
      // Let PostForm's generic error handling display a toast
      throw error; 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isMounted) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-1/4 ml-auto" />
      </div>
    );
  }

  if (!isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to create posts.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">Go to Admin Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PostForm onSubmitForm={handleCreatePost} isSubmitting={isSubmitting} />
    </div>
  );
}
