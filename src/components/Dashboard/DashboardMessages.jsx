import React from 'react';
import { MessageSquare } from 'lucide-react';
import LiveChatWidget from '../Support/LiveChatWidget';

/** Messages tab — uses the live support chat widget for real messaging. */
export default function DashboardMessages() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageSquare /> Messages
      </h1>
      <p className="text-gray-600 mb-6">Use the chat below to message support or continue an active conversation.</p>
      <div className="relative min-h-[400px] border rounded-xl bg-gray-50 p-4">
        <LiveChatWidget forceOpen />
      </div>
    </div>
  );
}
