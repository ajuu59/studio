import { PostCard } from '@/components/blog/PostCard';
import { SearchBar } from '@/components/blog/SearchBar';
import { mockPosts } from '@/data/mock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Content Canvas
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover insightful articles, tutorials, and stories from our talented authors.
        </p>
        <SearchBar />
      </section>

      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Placeholder for pagination or load more */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">Load More Posts</Button>
      </div>
    </div>
  );
}
