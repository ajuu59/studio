
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderKanban, FileText } from 'lucide-react';

interface CategorizedPosts {
  [categoryName: string]: Post[];
}

interface CategoriesSidebarProps {
  categorizedPosts: CategorizedPosts;
}

export function CategoriesSidebar({ categorizedPosts }: CategoriesSidebarProps) {
  const sortedCategories = Object.keys(categorizedPosts).sort((a, b) => {
    if (a === 'Uncategorized') return 1; // Push "Uncategorized" to the end
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  if (Object.keys(categorizedPosts).length === 0) {
    return (
      <Card className="sticky top-20 shadow-md"> {/* Sticky position for sidebar */}
        <CardHeader>
          <CardTitle className="text-xl font-sans flex items-center">
            <FolderKanban className="mr-2 h-5 w-5 text-primary" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No categories found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-20 shadow-md"> {/* Sticky position for sidebar */}
      <CardHeader>
        <CardTitle className="text-xl font-sans flex items-center">
           <FolderKanban className="mr-2 h-5 w-5 text-primary" />
           Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-18rem)] pr-3"> {/* Adjusted height and padding */}
          <div className="space-y-5">
            {sortedCategories.map((categoryName) => (
              <div key={categoryName}>
                <h3 className="text-lg font-semibold mb-2 pb-1 border-b border-border flex items-center font-sans">
                  {categoryName}
                </h3>
                {categorizedPosts[categoryName].length > 0 ? (
                  <ul className="space-y-1.5 list-none pl-1">
                    {categorizedPosts[categoryName].map((post) => (
                      <li key={post.id} className="flex items-start">
                        <FileText className="h-3.5 w-3.5 mr-2 mt-[0.3rem] text-muted-foreground flex-shrink-0" />
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors duration-150 font-serif leading-snug"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                   <p className="text-xs text-muted-foreground pl-1 font-serif">No posts in this category.</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
