import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Basic function to strip HTML for excerpt
  const createExcerpt = (htmlContent: string, length = 150) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, '');
    return textContent.length > length ? textContent.substring(0, length) + '...' : textContent;
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        {post.imageUrl && (
          <Link href={`/posts/${post.slug}`} aria-label={`Read more about ${post.title}`}>
            <div className="relative aspect-video w-full mb-4 rounded-t-md overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={post.imageHint || "blog post"}
              />
            </div>
          </Link>
        )}
        <CardTitle className="text-xl md:text-2xl">
          <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: createExcerpt(post.content) }} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        {post.category && (
          <Badge variant="secondary" className="mb-2">{post.category.name}</Badge>
        )}
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Badge key={tag.id} variant="outline">{tag.name}</Badge>
          ))}
        </div>
        <Link href={`/posts/${post.slug}`} className="text-primary hover:underline mt-2 text-sm font-medium">
          Read More &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
