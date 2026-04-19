"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  type: 'contribution' | 'payout' | 'dispute';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    groupId?: string;
    amount?: string;
    userId?: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
});

let eventSource: EventSource | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function getNotificationType(type: string): 'contribution' | 'payout' | 'dispute' {
  if (type.includes('contribution')) return 'contribution';
  if (type.includes('payout')) return 'payout';
  if (type.includes('dispute')) return 'dispute';
  return 'contribution';
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-mark as read after 10 seconds if not clicked
    setTimeout(() => {
      setNotifications((prev) => 
        prev.map(n => n.id === newNotification.id ? { ...n, read: true } : n)
      );
    }, 10000);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Connect to SSE endpoint
  useEffect(() => {
    const connectSSE = () => {
      if (typeof window === 'undefined') return;

      // Replace with your actual SSE endpoint
      const sseUrl = `${process.env.NEXT_PUBLIC_RPC_URL}/api/notifications/sse`;

      eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        reconnectAttempts = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          const notification: Notification = {
            id: Date.now().toString(),
            type: getNotificationType(data.type || 'contribution'),
            title: data.title || 'New notification',
            message: data.message || 'You have a new notification',
            timestamp: new Date().toISOString(),
            read: false,
            data: data.data,
          };

          addNotification(notification);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource?.close();

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          setTimeout(connectSSE, delay);
          reconnectAttempts++;
        }
      };
    };

    connectSSE();

    return () => {
      eventSource?.close();
    };
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}