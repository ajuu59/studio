"use client";

import type { Comment } from '@/lib/types';
import { CommentForm } from './CommentForm';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  comments: Comment[]; // Should be fetched or managed via state
  onNewComment: (commentData: { author: string, content: string }) => void; // Callback to handle new comment
  onDeleteComment?: (commentId: string) => void; // For moderation
}

export function CommentSection({ postId, comments, onNewComment, onDeleteComment }: CommentSectionProps) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Comments ({comments.length})</h2>
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 p-4 border rounded-lg bg-card">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40.png?text=${comment.author.substring(0,1)}`} alt={comment.author} data-ai-hint="avatar person" />
                <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{comment.author}</p>
                  {isAuthenticated(['Admin', 'Editor']) && onDeleteComment && (
                     <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDeleteComment(comment.id)}>
                       <Trash2 className="h-4 w-4 mr-1" /> Delete
                     </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
                <p className="text-sm text-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      )}
      
      <CommentForm postId={postId} onCommentSubmit={onNewComment} />
    </div>
  );
}
