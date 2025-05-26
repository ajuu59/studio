
"use client"; // This component handles client-side interactions

import { useEffect, useState } from 'react';
import type { Post, Comment as CommentType, Category, Tag } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { CommentSection } from '@/components/blog/CommentSection';
import useLocalStorage from '@/hooks/useLocalStorage';

interface PostDisplayProps {
  post: Post; // Expects the fully transformed Post object
  slug: string;
}

export function PostDisplay({ post, slug }: PostDisplayProps) {
  // Use local storage for comments, specific to this post
  const [comments, setComments] = useLocalStorage<CommentType[]>(`comments_${slug}`, []);

  // Derive category and tags for display from the Post object
  // The Post object passed as a prop should already be transformed.
  const displayCategory = post.category;
  const displayTags = post.tags || [];


  const handleNewComment = (commentData: { author: string, content: string }) => {
    const newComment: CommentType = {
      id: Date.now().toString(), // Simple unique ID
      postId: post.id,
      author: commentData.author,
      content: commentData.content,
      createdAt: new Date().toISOString(),
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prevComments => prevComments.filter(c => c.id !== commentId));
  };

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 font-sans">{post.title}</h1>
        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 font-sans">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </span>
          {displayCategory && (
            <Badge variant="secondary">{displayCategory.name}</Badge>
          )}
        </div>
      </header>

      {/* Image section removed */}

      <div
        className="prose prose-lg dark:prose-invert max-w-none break-words" // Removed explicit font-serif, prose class handles it
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {displayTags.length > 0 && (
        <div className="mt-8 pt-4 border-t font-sans">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-1">
            <TagIcon className="h-4 w-4" /> TAGS
          </h3>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <Badge key={tag.id} variant="outline">{tag.name}</Badge>
            ))}
          </div>
        </div>
      )}

      <CommentSection postId={post.id} comments={comments} onNewComment={handleNewComment} onDeleteComment={handleDeleteComment} />
    </article>
  );
}
