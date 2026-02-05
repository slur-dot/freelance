import React from "react";
import AlexandraImg from "../../../../assets/Alexandra.png";

function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function EnhancedNotifications({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="text-center text-gray-500">
          <p>No notifications found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
      <div className="space-y-3">
        {notifications.slice(0, 7).map((notification, index) => (
          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'}`}>
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img src={AlexandraImg} alt={notification.from} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


