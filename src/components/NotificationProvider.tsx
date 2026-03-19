"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@/app/providers";

export type NotificationType = "contribution" | "payout" | "dispute";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  groupId?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useWallet();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const addNotification = useCallback((data: Omit<Notification, "id" | "timestamp" | "read">) => {
    const notification: Notification = {
      ...data,
      id: makeId(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (!isConnected || !address) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const url = `/api/notifications/stream?address=${encodeURIComponent(address)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener("contribution", (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({
          type: "contribution",
          title: "Contribution Received",
          message: d.message || `A contribution was made to group ${d.groupId}`,
          groupId: d.groupId,
        });
      } catch {}
    });

    es.addEventListener("payout", (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({
          type: "payout",
          title: "Payout Distributed",
          message: d.message || `Payout distributed for group ${d.groupId}`,
          groupId: d.groupId,
        });
      } catch {}
    });

    es.addEventListener("dispute", (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({
          type: "dispute",
          title: "Dispute Raised",
          message: d.message || `A dispute was raised in group ${d.groupId}`,
          groupId: d.groupId,
        });
      } catch {}
    });

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [isConnected, address, addNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
