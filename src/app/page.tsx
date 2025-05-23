
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllPosts } from '@/lib/db';
import type { Post as DbPost } from '@/lib/types'; // Database post type
import type { Post, Category, Tag } from '@/lib/types'; // Type expected by PostCard and used generally
import { CategoriesSidebar } from '@/components/blog/CategoriesSidebar';
import { NewVerticalSection } from '@/components/layout/NewVerticalSection';

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

interface CategorizedPosts {
  [categoryName: string]: Post[];
}

export default async function HomePage() {
  const dbPosts = await getAllPosts();
  const postsToDisplay: Post[] = dbPosts.map(transformDbPostToCardPost);

  const categorizedPosts: CategorizedPosts = postsToDisplay.reduce((acc, post) => {
    const categoryKey = post.categoryName || 'Uncategorized';
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(post);
    return acc;
  }, {} as CategorizedPosts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Main content area - shows all posts in cards */}
      <section className="md:col-span-6 lg:col-span-6 space-y-12">
        <div className="text-center py-10 md:py-0 md:text-left"> {/* Adjusted padding for md screens */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Intelligent Automation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl md:mx-0 mx-auto mb-8">
            Discover insightful articles, latest news, tutorials, and stories around testing, dev, devops etc with Artificial Intelligence.
          </p>
        </div>

        {postsToDisplay.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts available yet. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8"> {/* Adjusted for narrower main content */}
            {postsToDisplay.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {postsToDisplay.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More Posts</Button>
          </div>
        )}
      </section>

      {/* Categories Sidebar area */}
      <aside className="md:col-span-3 lg:col-span-3">
        <CategoriesSidebar categorizedPosts={categorizedPosts} />
      </aside>

      {/* New Vertical Section area */}
      <aside className="md:col-span-3 lg:col-span-3">
        <NewVerticalSection />
      </aside>
    </div>
  );
}
