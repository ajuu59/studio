
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, FileText, Image as ImageIcon, Users, BarChart2, Database } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { runInitializeDatabaseAction } from './posts/new/actions'; 
import { useToast } from "@/hooks/use-toast"; 
import { getPostsForAdminAction } from './actions';
import type { Post } from '@/lib/types';

export default function AdminPage() {
  const { userRole, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializingDb, setIsInitializingDb] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
      async function fetchPosts() {
        setIsLoadingPosts(true);
        setPostsError(null);
        const result = await getPostsForAdminAction();
        if ('error' in result) {
          setPostsError(result.error);
          toast({ title: "Error Loading Posts", description: result.error, variant: "destructive" });
        } else {
          setPosts(result);
        }
        setIsLoadingPosts(false);
      }
      fetchPosts();
    } else if (isMounted) {
      // If mounted but not authenticated to see posts, stop loading.
      setIsLoadingPosts(false);
    }
  }, [isMounted, isAuthenticated, toast, userRole]); // userRole added to re-fetch if role changes and grants access

  const handleInitializeDatabase = async () => {
    setIsInitializingDb(true);
    try {
      const result = await runInitializeDatabaseAction();
      if (result.success) {
        toast({
          title: "Database Initialization",
          description: result.message,
        });
        // Optionally re-fetch posts after successful DB initialization
        if (isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
          async function fetchPosts() {
            setIsLoadingPosts(true);
            setPostsError(null);
            const result = await getPostsForAdminAction();
            if ('error' in result) {
              setPostsError(result.error);
            } else {
              setPosts(result);
            }
            setIsLoadingPosts(false);
          }
          fetchPosts();
        }
      } else {
        toast({
          title: "Database Initialization Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsInitializingDb(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/5 mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-48" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated(['Admin', 'Editor', 'Contributor'])) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button asChild className="mt-4">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  const handleEditPost = (postId: string) => {
    router.push(`/admin/posts/edit/${postId}`);
  };
  const handleDeletePost = (postId: string) => console.log(`Delete post ${postId}`); // Placeholder

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
          <CardDescription>Manage your blog content and settings. Your current role: <Badge variant="secondary">{userRole}</Badge></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
            {isAuthenticated(['Admin', 'Editor', 'Contributor']) && (
              <Button asChild>
                <Link href="/admin/posts/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
                </Link>
              </Button>
            )}
            {isAuthenticated(['Admin', 'Editor']) && (
              <Button variant="outline">
                <ImageIcon className="mr-2 h-4 w-4" /> Manage Media
              </Button>
            )}
          {isAuthenticated(['Admin']) && (
            <>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </Button>
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleInitializeDatabase}
              disabled={isInitializingDb}
            >
              <Database className="mr-2 h-4 w-4" /> 
              {isInitializingDb ? 'Initializing DB...' : 'Initialize Database'}
            </Button>
            </>
          )}
        </CardContent>
      </Card>

      {isAuthenticated(['Admin', 'Editor', 'Contributor']) && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Posts</CardTitle>
            <CardDescription>View, edit, or delete existing blog posts.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPosts && (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {!isLoadingPosts && postsError && (
              <p className="text-destructive">Error loading posts: {postsError}</p>
            )}
            {!isLoadingPosts && !postsError && posts.length === 0 && (
              <p className="text-muted-foreground">No posts found. Start by creating a new post.</p>
            )}
            {!isLoadingPosts && !postsError && posts.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    (userRole === 'Contributor' && post.author !== userRole) ? null : ( // Simplified Contributor check
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.categoryName || 'N/A'}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        {isAuthenticated(['Admin', 'Editor']) || (isAuthenticated(['Contributor']) && post.author === userRole) ? (
                          <div className="space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditPost(post.id)} aria-label="Edit Post">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {isAuthenticated(['Admin', 'Editor']) && (
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePost(post.id)} aria-label="Delete Post">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No actions</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
