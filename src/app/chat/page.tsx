
import { ChatInterface } from '@/components/ai/ChatInterface';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat Assistant',
  description: 'Chat with the Content Canvas AI assistant.',
};

export default function ChatPage() {
  return (
    // The ChatInterface component itself will manage its height
    // So we don't need explicit py-8 here if we want it to take more vertical space.
    // The ChatInterface is styled with h-[calc(100vh-Xrem)] to fill available space.
    <ChatInterface />
  );
}
