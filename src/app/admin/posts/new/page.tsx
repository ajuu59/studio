
"use client";

import { PostForm } from "@/components/blog/PostForm";
import type { PostFormValues } from "@/components/blog/PostForm"; // Assuming PostFormValues is exported
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { addPost, type NewPostDbInput } from '@/lib/db'; // Import addPost and its input type

export default function NewPostPage() {
  const { isAuthenticated, userRole } = useAuth(); // Get userRole for author
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreatePost = async (formData: PostFormValues) => {
    if (!userRole || userRole === 'Guest') {
        // This case should ideally be prevented by the isAuthenticated check below,
        // but good for robustness.
        console.error("Cannot create post: User is not authenticated or is a Guest.");
        throw new Error("User not authorized to create posts.");
    }
    setIsSubmitting(true);
    try {
      const postData: NewPostDbInput = {
        title: formData.title,
        content: formData.content,
        author: userRole, // Use the role of the currently logged-in user as author
        categoryName: formData.category,
        tagsCsv: formData.tags,
        scheduledAt: formData.scheduledAt, // This is a Date object from the form or undefined
      };
      await addPost(postData);
      // The PostForm's onSubmit will show a success toast
      // Optionally, you can redirect or clear the form here.
      // e.g., router.push('/admin'); or form.reset(); if you have access to form instance
      console.log("Post created successfully with data:", postData);
    } catch (error) {
      console.error("Failed to create post", error);
      throw error; // Re-throw to be caught by PostForm's toast
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
