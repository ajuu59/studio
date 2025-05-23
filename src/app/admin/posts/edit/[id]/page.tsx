
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostForm, type PostFormValues } from '@/components/blog/PostForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getPostForEditAction, updatePostAction } from './actions';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [initialData, setInitialData] = useState<PostFormValues | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const postId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!postId || !isMounted) return;

    if (!isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
      setIsLoadingData(false);
      setError("Access Denied: You do not have permission to edit posts.");
      return;
    }
    
    async function fetchPost() {
      setIsLoadingData(true);
      setError(null);
      const result = await getPostForEditAction(postId);
      if ('error' in result) {
        setError(result.error);
        toast({
          title: "Error Loading Post",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setInitialData(result);
      }
      setIsLoadingData(false);
    }
    fetchPost();
  }, [postId, toast, isAuthenticated, isMounted]);

  const handleUpdatePost = async (formData: PostFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updatePostAction(postId, formData);
      if ('error' in result) {
        throw new Error(result.error || "An unknown error occurred while updating the post.");
      }
      toast({
        title: "Post Updated",
        description: "Your post has been successfully updated.",
      });
      router.push('/admin'); // Redirect to admin dashboard or post page
    } catch (err) {
      console.error("Error during post update process client-side:", err);
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
      // The error will also be caught by PostForm's generic error handler if it re-throws
      // or if PostForm's onSubmitForm expects a promise that can reject.
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isMounted || isLoadingData) {
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

  if (error) {
    return (
      <div className="text-center py-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-destructive">Error</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild>
          <Link href="/admin">Go to Admin Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  if (!isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
     return (
      <div className="text-center py-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to edit posts.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">Go to Admin Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!initialData) {
    // Should be covered by error state if post not found, but as a fallback
    return (
      <div className="text-center py-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground">The post you are trying to edit could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">Go to Admin Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <PostForm
        initialData={initialData}
        onSubmitForm={handleUpdatePost}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
