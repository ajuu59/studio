
import { PostCard } from '@/components/blog/PostCard';
import { SearchBar } from '@/components/blog/SearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllPosts } from '@/lib/db';
import type { Post as DbPost } from '@/lib/types'; // Database post type
import type { Post as CardPost, Category, Tag } from '@/lib/types'; // Type expected by PostCard

// Helper function to transform DbPost to CardPost
function transformDbPostToCardPost(dbPost: DbPost): CardPost {
  const category: Category | undefined = dbPost.categoryName
    ? { id: dbPost.categoryName, name: dbPost.categoryName } // Using name as ID for simplicity
    : undefined;

  const tags: Tag[] = dbPost.tagsCsv
    ? dbPost.tagsCsv.split(',').map(tagName => ({ id: tagName.trim(), name: tagName.trim() }))
    : [];
  
  // Ensure all fields expected by PostCard are present, even if some are from DbPost
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content, // PostCard creates an excerpt from this
    author: dbPost.author,
    createdAt: dbPost.createdAt,
    updatedAt: dbPost.updatedAt,
    // These are transformed for PostCard compatibility
    category: category, 
    tags: tags,
    // These are specific to DbPost and might not be directly used by PostCard
    // but are part of the full Post type definition that PostCard might expect.
    categoryName: dbPost.categoryName,
    tagsCsv: dbPost.tagsCsv,
    scheduledAt: dbPost.scheduledAt,
  };
}


export default async function HomePage() {
  const dbPosts = await getAllPosts();
  const postsToDisplay: CardPost[] = dbPosts.map(transformDbPostToCardPost);

  return (
    <div className="space-y-12">
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Intelligent Automation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover insightful articles, tutorials, and stories from our talented authors.
        </p>
        <SearchBar />
      </section>

      <section>
        {postsToDisplay.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts available yet. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsToDisplay.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Placeholder for pagination or load more */}
      {postsToDisplay.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">Load More Posts</Button>
        </div>
      )}
    </div>
  );
}
