
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllPosts, countAllPosts } from '@/lib/db';
import type { Post as DbPost } from '@/lib/types'; // Database post type
import type { Post, Category, Tag } from '@/lib/types'; // Type expected by PostCard and used generally
import { CategoriesSidebar } from '@/components/blog/CategoriesSidebar';
import { PostsList } from '@/components/blog/PostsList'; // Import the new client component

const POSTS_PER_PAGE = 6; // Initial number of posts to load

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
  const initialDbPosts = await getAllPosts({ limit: POSTS_PER_PAGE, offset: 0 });
  const totalPosts = await countAllPosts();
  const initialPostsToDisplay: Post[] = initialDbPosts.map(transformDbPostToCardPost);

  // For CategoriesSidebar, we still need all posts for categorization, or we adjust it later.
  // For simplicity, let's fetch all posts for categorization sidebar for now. This could be optimized.
  const allDbPostsForCategorization = await getAllPosts();
  const allPostsForCategorization: Post[] = allDbPostsForCategorization.map(transformDbPostToCardPost);


  const categorizedPosts: CategorizedPosts = allPostsForCategorization.reduce((acc, post) => {
    const categoryKey = post.categoryName || 'Uncategorized';
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(post);
    return acc;
  }, {} as CategorizedPosts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <section className="md:col-span-2 space-y-12">
        <div className="text-center py-10 md:py-0 md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Test with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl md:mx-0 mx-auto mb-8">
            Discover insightful articles, latest news around Artificial Intelligence.
          </p>
        </div>

        <PostsList initialPosts={initialPostsToDisplay} totalPosts={totalPosts} />

      </section>

      <aside className="md:col-span-1">
        <CategoriesSidebar categorizedPosts={categorizedPosts} />
      </aside>
    </div>
  );
}

