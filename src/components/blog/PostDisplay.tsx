"use client"; // This component handles client-side interactions

import type { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { markdownToHtml } from '@/lib/markdown';

interface PostDisplayProps {
  post: Post; // Expects the fully transformed Post object
  slug: string; // Slug might still be useful for other potential features
}

export function PostDisplay({ post, slug }: PostDisplayProps) {
  // Derive category and tags for display from the Post object
  // The Post object passed as a prop should already be transformed.
  const displayCategory = post.category;
  const displayTags = post.tags || [];

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

      <div
        className="prose prose-lg dark:prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
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

      <div className="mt-12 pt-6 border-t text-center">
        <a
          href="/about"
          className="text-primary hover:underline text-lg font-sans"
        >
          Read about me ...
        </a>
      </div>
    </article>
  );
}
