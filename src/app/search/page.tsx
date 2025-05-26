
import type { Metadata } from 'next';
import { searchPosts } from '@/lib/db';
import type { Post as DbPost } from '@/lib/types'; // Database post type
import type { Post, Category, Tag } from '@/lib/types'; // Type expected by PostCard
import { PostCard } from '@/components/blog/PostCard';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Helper function to transform DbPost to CardPost (which is essentially our full Post type)
function transformDbPostToCardPost(dbPost: DbPost): Post {
  const category: Category | undefined = dbPost.categoryName
    ? { id: dbPost.categoryName, name: dbPost.categoryName }
    : undefined;

  const tags: Tag[] = dbPost.tagsCsv
    ? dbPost.tagsCsv.split(',').map(tagName => ({ id: tagName.trim(), name: tagName.trim() }))
    : [];

  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content,
    author: dbPost.author,
    createdAt: dbPost.createdAt,
    updatedAt: dbPost.updatedAt,
    category: category,
    tags: tags,
    categoryName: dbPost.categoryName,
    tagsCsv: dbPost.tagsCsv,
    scheduledAt: dbPost.scheduledAt,
  };
}

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = searchParams.q || '';
  if (query) {
    return {
      title: `Search results for "${query}" | ${APP_NAME}`,
      description: `Find posts matching the query: ${query}`,
    };
  }
  return {
    title: `Search | ${APP_NAME}`,
    description: `Search for posts on ${APP_NAME}.`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  let postsToDisplay: Post[] = [];
  let error: string | null = null;

  if (query) {
    try {
      const dbPosts = await searchPosts(query);
      postsToDisplay = dbPosts.map(transformDbPostToCardPost);
    } catch (e) {
      console.error("Error fetching search results:", e);
      error = "There was an error fetching search results. Please try again later.";
    }
  }

  return (
    <div className="space-y-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 font-sans">
          {query ? `Search Results for "${query}"` : 'Search Posts'}
        </h1>
        {!query && (
          <p className="text-muted-foreground">
            Please enter a search term in the bar above to find posts.
          </p>
        )}
      </header>

      {error && (
        <div className="text-center py-10">
          <p className="text-destructive mb-4">{error}</p>
          <Button asChild variant="outline">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      )}

      {!error && query && postsToDisplay.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No posts found matching your query: "{query}".</p>
          <Button asChild variant="outline">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      )}

      {!error && postsToDisplay.length > 0 && (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {postsToDisplay.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
