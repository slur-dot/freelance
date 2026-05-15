import React, { useState } from 'react';
import { MessageCircle, Send, Search, ArrowLeft } from 'lucide-react';

const mockConversations = [
  { id: 1, name: 'Amadou Diallo', role: 'Freelancer', lastMessage: 'I\'ve finished the mockups, please review.', time: '2h ago', unread: 2, avatar: null },
  { id: 2, name: 'Support Team', role: 'Support', lastMessage: 'Your ticket #1042 has been resolved.', time: '1d ago', unread: 0, avatar: null },
  { id: 3, name: 'Fatima Camara', role: 'Freelancer', lastMessage: 'When would you like to schedule the call?', time: '3d ago', unread: 1, avatar: null },
];

const mockMessages = {
  1: [
    { id: 1, from: 'them', text: 'Hi! I\'ve started working on the dashboard.', time: '10:00 AM' },
    { id: 2, from: 'me', text: 'Great, looking forward to the progress.', time: '10:15 AM' },
    { id: 3, from: 'them', text: 'I\'ve finished the mockups, please review.', time: '2:30 PM' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Hello, how can we help you today?', time: '9:00 AM' },
    { id: 2, from: 'me', text: 'I have an issue with my last order.', time: '9:05 AM' },
    { id: 3, from: 'them', text: 'Your ticket #1042 has been resolved.', time: '11:00 AM' },
  ],
  3: [
    { id: 1, from: 'them', text: 'When would you like to schedule the call?', time: '4:00 PM' },
  ],
};

export default function ClientMessages() {
  const [conversations] = useState(mockConversations);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filtered = conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const messages = selectedConvo ? (mockMessages[selectedConvo.id] || []) : [];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Messages</h1>
      <p className="text-gray-500 mb-6">Communicate with freelancers and support directly from your dashboard.</p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex" style={{ height: '500px' }}>
        {/* Conversation List */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? filtered.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedConvo(c)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedConvo?.id === c.id ? 'bg-green-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm text-gray-900 truncate">{c.name}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">{c.unread}</span>}
                </div>
              </div>
            )) : (
              <div className="text-center py-16 px-4">
                <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">No conversations yet.</p>
                <p className="text-xs text-gray-400 mt-1">Start by hiring a freelancer or contacting support.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <button onClick={() => setSelectedConvo(null)} className="md:hidden p-1 hover:bg-gray-100 rounded"><ArrowLeft className="w-5 h-5" /></button>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">{selectedConvo.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm">{selectedConvo.name}</p>
                  <p className="text-xs text-gray-400">{selectedConvo.role}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.from === 'me' ? 'bg-green-600 text-white rounded-br-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'}`}>
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-green-200' : 'text-gray-400'}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Select a conversation</p>
                <p className="text-sm text-gray-400 mt-1">Choose a conversation from the list to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
