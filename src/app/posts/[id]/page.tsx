'use client'; // Mark as client component due to state and potential localStorage use

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockPosts } from '@/data/mock';
import type { Post, Comment as CommentType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { CommentSection } from '@/components/blog/CommentSection';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// This is a placeholder. In a real app, you'd fetch by ID/slug.
const findPostBySlug = (slug: string): Post | undefined => {
  return mockPosts.find(p => p.slug === slug);
};

export default function PostPage() {
  const params = useParams();
  const slug = typeof params.id === 'string' ? params.id : '';
  const [post, setPost] = useState<Post | null>(null);
  
  // Use local storage for comments, specific to this post
  const [comments, setComments] = useLocalStorage<CommentType[]>(`comments_${slug}`, []);

  useEffect(() => {
    if (slug) {
      const foundPost = findPostBySlug(slug);
      setPost(foundPost || null);
      // If post not found, maybe redirect or show 404.
      // For now, it will just render "Post not found".
    }
  }, [slug]);

  const handleNewComment = (commentData: { author: string, content: string }) => {
    const newComment: CommentType = {
      id: Date.now().toString(), // Simple unique ID
      postId: post!.id,
      author: commentData.author,
      content: commentData.content,
      createdAt: new Date().toISOString(),
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prevComments => prevComments.filter(c => c.id !== commentId));
  };


  if (!post) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground mt-2">The post you are looking for does not exist or may have been moved.</p>
         <Button asChild className="mt-4">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </span>
          {post.category && (
            <Badge variant="secondary">{post.category.name}</Badge>
          )}
        </div>
      </header>

      {post.imageUrl && (
        <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-md">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            priority // Good for LCP on post pages
            data-ai-hint={post.imageHint || "blog post image"}
          />
        </div>
      )}

      <div 
        className="prose prose-lg dark:prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-1">
            <TagIcon className="h-4 w-4" /> TAGS
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">{tag.name}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <CommentSection postId={post.id} comments={comments} onNewComment={handleNewComment} onDeleteComment={handleDeleteComment} />
    </article>
  );
}

// Add basic metadata generation
export async function generateMetadata({ params }: { params: { id: string }}) {
  const post = findPostBySlug(params.id);
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }
  const excerpt = post.content.replace(/<[^>]+>/g, '').substring(0, 150);
  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  }
}
