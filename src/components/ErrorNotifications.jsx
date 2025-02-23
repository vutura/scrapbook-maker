// src/components/ErrorNotifications.jsx
import React from 'react';

const ErrorNotifications = ({ errors, notifications }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Errors */}
      {errors.map(error => (
        <div
          key={error.id}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg
                     flex items-start space-x-3 animate-slide-in"
        >
          <div className="flex-1">
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      ))}

      {/* Notifications */}
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded shadow-lg flex items-start space-x-3 animate-slide-in
                     ${notification.type === 'success' 
                       ? 'bg-green-50 border-l-4 border-green-500' 
                       : 'bg-blue-50 border-l-4 border-blue-500'}`}
        >
          <div className="flex-1">
            <p className={`${
              notification.type === 'success' ? 'text-green-700' : 'text-blue-700'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ErrorNotifications;