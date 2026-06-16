import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2 } from 'lucide-react';

export default function DashboardNotifications() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    NotificationService.getUserNotifications(currentUser.uid)
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleClick = async (n) => {
    if (!n.read) await NotificationService.markAsRead(n.id);
    if (n.link) navigate(n.link);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell /> Notifications
      </h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => handleClick(n)}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${n.read ? 'bg-white' : 'bg-green-50 border-green-200'}`}
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
