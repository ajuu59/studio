
"use client";

import { PostForm } from "@/components/blog/PostForm";
import type { PostFormValues } from "@/components/blog/PostForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createPostAction } from './actions'; 
import type { NewPostDbInput } from '@/lib/db'; 
import { useToast } from "@/hooks/use-toast"; 

export default function NewPostPage() {
  const { isAuthenticated, userRole, authorName } = useAuth(); // Added authorName
  const { toast } = useToast(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreatePost = async (formData: PostFormValues) => {
    if (!userRole || userRole === 'Guest' || !authorName) { // Added check for authorName
        console.error("Cannot create post: User not authorized or author name missing.");
        toast({ 
          title: "Authorization Error",
          description: "User not authorized or author information is missing.",
          variant: "destructive",
        });
        throw new Error("User not authorized or author information is missing."); 
    }
    setIsSubmitting(true);
    try {
      const postData: NewPostDbInput = {
        title: formData.title,
        content: formData.content,
        author: authorName, // Use authorName from AuthContext
        categoryName: formData.category,
        tagsCsv: formData.tags,
        scheduledAt: formData.scheduledAt,
      };
      
      const result = await createPostAction(postData);

      if ('error' in result) {
        let description = result.error || "An unknown error occurred while creating the post.";
        const resultWithErrorAndHint = result as { error: string; details?: any; hint?: string };
        if (resultWithErrorAndHint.hint) {
          description += ` Hint: ${resultWithErrorAndHint.hint}`;
        }
        throw new Error(description);
      }
      
      console.log("Post created successfully with ID:", result.id);

    } catch (error) {
      console.error("Error during post creation process client-side:", error);
      throw error; 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isMounted) {
    return (
      <div className="space-y-4 p-4 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/4 ml-auto" />
      </div>
    );
  }

  if (!isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
    return (
      <div className="text-center py-10 max-w-3xl mx-auto">
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

