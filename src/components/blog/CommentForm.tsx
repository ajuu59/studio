"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

interface CommentFormProps {
  postId: string;
  onCommentSubmit: (comment: { author: string, content: string }) => void;
}

export function CommentForm({ postId, onCommentSubmit }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter your name and comment.",
        variant: "destructive",
      });
      return;
    }
    onCommentSubmit({ author, content });
    // In a real app, you might store author in localStorage or get from auth context
    // setAuthor(''); 
    setContent('');
    toast({
      title: "Comment Submitted",
      description: "Your comment is awaiting moderation.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold">Leave a Comment</h3>
      <div>
        <Input 
          type="text" 
          placeholder="Your Name" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          className="mb-2"
          aria-label="Your Name"
        />
        <Textarea 
          placeholder="Write your comment here..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          aria-label="Your Comment"
        />
      </div>
      <Button type="submit">Post Comment</Button>
    </form>
  );
}
