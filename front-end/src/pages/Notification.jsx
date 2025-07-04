import React, { useState, useEffect } from 'react';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setNotifications([       
        "Visit with full of yours patience and enjoy it",
        "It is appreciated to share your experience with us ",
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="md:w-3/5 mx-auto mt-5 p-4  shadow-lg rounded-lg overflow-y-scroll h-screen">
      <h1 className="text-xl font-bold mb-3 text-center ">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-md shadow-md border-l-4 border-blue-500">
            <p className="text-gray-700">{notification}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Notification;
