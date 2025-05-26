
"use client";

import { useState, useEffect } from 'react';
import type { Post } from '@/lib/types';
import { PostCard } from './PostCard';
import { Button } from '@/components/ui/button';
import { loadMorePostsAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 6; // Number of posts to load each time

interface PostsListProps {
  initialPosts: Post[];
  totalPosts: number;
}

export function PostsList({ initialPosts, totalPosts }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [offset, setOffset] = useState<number>(initialPosts.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialPosts.length < totalPosts);

  useEffect(() => {
    // Update hasMore when initialPosts or totalPosts change
    setHasMore(posts.length < totalPosts);
  }, [posts.length, totalPosts]);
  
  useEffect(() => {
    // Reset state if initialPosts prop changes (e.g., due to navigation or filter changes)
    setPosts(initialPosts);
    setOffset(initialPosts.length);
    setHasMore(initialPosts.length < totalPosts);
  }, [initialPosts, totalPosts]);


  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newPosts = await loadMorePostsAction(offset, POSTS_PER_PAGE);
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setOffset(prev => prev + newPosts.length);
        if ((offset + newPosts.length) >= totalPosts) {
          setHasMore(false);
        }
      } else {
        setHasMore(false); // No more posts returned from the server
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
      // Optionally, show a toast message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (initialPosts.length === 0 && !isLoading) {
    return <p className="text-center text-muted-foreground col-span-full">No posts available yet. Check back soon!</p>;
  }
  
  return (
    <>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <div key={post.id} className={index === 0 ? 'lg:col-span-2' : ''}>
            <PostCard post={post} />
          </div>
        ))}
        {isLoading && Array.from({ length: POSTS_PER_PAGE / 2 }).map((_, index) => ( 
          <Card key={`skeleton-post-${index}`} className="flex flex-col h-full shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-1" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <Skeleton className="h-6 w-20 mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-5 w-24 mt-2" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleLoadMore} 
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}
    </>
  );
}

// Skeleton Card for loading state (can be a separate component if preferred)
const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>{children}</div>
);
const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>{children}</div>
);
const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>{children}</div>
);
const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>{children}</div>
);
