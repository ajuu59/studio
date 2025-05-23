
"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, FileText, Image as ImageIcon, Users, BarChart2 } from 'lucide-react';
import { mockPosts } from '@/data/mock'; // For listing posts
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

export default function AdminPage() {
  const { userRole, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Mock handlers
  const handleEditPost = (postId: string) => console.log(`Edit post ${postId}`);
  const handleDeletePost = (postId: string) => console.log(`Delete post ${postId}`);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
          <CardDescription>Manage your blog content and settings. Your current role: <Badge variant="secondary">{userRole}</Badge></CardDescription>
        </CardHeader>
        {isAuthenticated(['Admin', 'Editor']) && (
        <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/posts/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
              </Link>
            </Button>
            <Button variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" /> Manage Media
            </Button>
          {isAuthenticated(['Admin']) && (
            <>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </Button>
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
            </Button>
            </>
          )}
        </CardContent>
        )}
      </Card>

      {isAuthenticated(['Admin', 'Editor', 'Contributor']) && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Posts</CardTitle>
            <CardDescription>View, edit, or delete existing blog posts.</CardDescription>
          </CardHeader>
          <CardContent>
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
                {mockPosts.map((post) => (
                  // Filter posts by author for 'Contributor' role (simplified example)
                  (userRole === 'Contributor' && post.author !== 'Contributor User' && post.author !== userRole) ? null : (
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
