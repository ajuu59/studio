
// This file is now a Server Component by default (no "use client")

import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation'; // Used for 404
import { mockPosts } from '@/data/mock';
import type { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { PostDisplay } from '@/components/blog/PostDisplay'; // New client component
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// This function runs on the server
const findPostBySlug = (slug: string): Post | undefined => {
  return mockPosts.find(p => p.slug === slug);
};

// generateMetadata runs on the server
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = findPostBySlug(params.id);
  if (!post) {
    return {
      title: 'Post Not Found'
    };
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
  };
}

// This default export is the Server Component for the page
export default async function PostPage({ params }: { params: { id: string } }) {
  const slug = params.id;
  const post = findPostBySlug(slug);

  if (!post) {
    // Use Next.js notFound() for proper 404 handling in Server Components
    // For a more styled 404, you would create a not-found.tsx file in this route segment
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

  // Pass the fetched post and slug to the client component
  return <PostDisplay post={post} slug={slug} />;
}
