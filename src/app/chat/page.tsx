
import { ChatInterface } from '@/components/ai/ChatInterface';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `AI Chat Assistant | ${APP_NAME}`,
  description: `Chat with the ${APP_NAME} AI assistant.`,
};

export default function ChatPage() {
  return (
    // The ChatInterface component itself will manage its height
    // So we don't need explicit py-8 here if we want it to take more vertical space.
    // The ChatInterface is styled with h-[calc(100vh-Xrem)] to fill available space.
    <ChatInterface />
  );
}
