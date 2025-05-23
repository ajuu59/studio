
"use client";

import { PostForm } from "@/components/blog/PostForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // For a loading placeholder

// Simulate API call
const createPostApi = (data: any) => {
  return new Promise<void>((resolve) => { // Removed reject
    setTimeout(() => {
      console.log("Submitting post data:", data);
      // Simulate success
      resolve();
    }, 1000);
  });
};


export default function NewPostPage() {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreatePost = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createPostApi(data);
      // Potentially redirect or clear form on success
    } catch (error) {
      console.error("Failed to create post", error);
      throw error; // Re-throw to be caught by PostForm's toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    // Render a placeholder or null during server render and initial client render
    // to avoid hydration mismatch.
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
