"use client";

import { PostForm } from "@/components/blog/PostForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

// Simulate API call
const createPostApi = (data: any) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      console.log("Submitting post data:", data);
      // Simulate success/failure
      if (Math.random() > 0.1) { // 90% success rate
        resolve();
      } else {
        reject(new Error("Simulated API error"));
      }
    }, 1000);
  });
};


export default function NewPostPage() {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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


  return (
    <div>
      <PostForm onSubmitForm={handleCreatePost} isSubmitting={isSubmitting} />
    </div>
  );
}
