import React, { useState } from 'react';
import { Bell, ShoppingBag, MessageCircle, Monitor, AlertTriangle, CheckCircle, Filter } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'order', message: 'Your order #ORD-4521 has been shipped.', time: '2 hours ago', read: false },
  { id: 2, type: 'message', message: 'New message from Amadou D. regarding your project.', time: '5 hours ago', read: false },
  { id: 3, type: 'device', message: 'Device MacBook Pro 16" is ready for pickup.', time: '1 day ago', read: false },
  { id: 4, type: 'system', message: 'Platform maintenance scheduled for May 5th.', time: '2 days ago', read: true },
  { id: 5, type: 'freelancer', message: 'Fatima C. completed milestone 2 of your project.', time: '3 days ago', read: true },
  { id: 6, type: 'order', message: 'Your order #ORD-4498 has been delivered.', time: '4 days ago', read: true },
];

const typeConfig = {
  order: { icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
  message: { icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  device: { icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-50' },
  system: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  freelancer: { icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

export default function ClientNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const toggleRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-gray-500 mt-1">Stay up to date with your orders, messages, and platform alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'order', 'message', 'device', 'freelancer', 'system'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length > 0 ? filtered.map(n => {
          const config = typeConfig[n.type] || typeConfig.system;
          const Icon = config.icon;
          return (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${!n.read ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-100'}`}
            >
              <div className={`p-2.5 rounded-xl ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
            </div>
          );
        }) : (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">You have no notifications at the moment.</p>
            <p className="text-sm text-gray-400 mt-1">We'll notify you when there are updates on your orders, messages, or projects.</p>
          </div>
        )}
      </div>
    </div>
  );
}
