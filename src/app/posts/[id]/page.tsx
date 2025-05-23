
// This file is now a Server Component by default (no "use client")

import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/db'; // Import the new DB function
import type { Post } from '@/lib/types';
import { PostDisplay } from '@/components/blog/PostDisplay';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Helper function to transform Post from DB to Post for PostDisplay
// This might be more complex if PostDisplay has significantly different needs
function transformPostForDisplay(dbPost: Post): Post {
    // For PostDisplay, we need to ensure category and tags are structured if they exist
    // The current Post type in types.ts already allows categoryName and tagsCsv
    // PostDisplay further processes these for rendering.
    // For now, direct pass-through is fine as PostDisplay handles it.
    return {
        ...dbPost,
        category: dbPost.categoryName ? { id: dbPost.categoryName, name: dbPost.categoryName } : undefined,
        tags: dbPost.tagsCsv ? dbPost.tagsCsv.split(',').map(t => ({ id: t.trim(), name: t.trim() })) : [],
    };
}


// generateMetadata runs on the server
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const postFromDb = await getPostBySlug(params.id); // Use slug from params.id
  if (!postFromDb) {
    return {
      title: 'Post Not Found'
    };
  }
  const post = transformPostForDisplay(postFromDb);
  // Basic excerpt, consider a more robust HTML stripping method if needed
  const excerpt = post.content.replace(/<[^>]+>/g, '').substring(0, 150); 
  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      // images: post.imageUrl ? [{ url: post.imageUrl }] : [], // Image removed
    },
  };
}

// This default export is the Server Component for the page
export default async function PostPage({ params }: { params: { id: string } }) {
  const slug = params.id;
  const postFromDb = await getPostBySlug(slug);

  if (!postFromDb) {
    return (
        <div className="text-center py-10 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
          <p className="text-muted-foreground mt-2">The post you are looking for does not exist or may have been moved.</p>
           <Button asChild className="mt-4">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      );
  }
  
  const postForDisplay = transformPostForDisplay(postFromDb);

  // Pass the fetched and transformed post and slug to the client component
  return <PostDisplay post={postForDisplay} slug={slug} />;
}
