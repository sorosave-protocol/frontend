"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

/** The types of events SoroSave can notify about. */
export type NotificationType =
  | "contribution_received"
  | "payout_distributed"
  | "dispute_raised"
  | "member_joined"
  | "round_started";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  /** Optional group id the notification relates to. */
  groupId?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  /** Whether the WebSocket / SSE connection is active. */
  isConnected: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

const STORAGE_KEY = "sorosave_notifications";
const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "wss://api.sorosave.io/notifications";
const MAX_NOTIFICATIONS = 100;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function labelForType(type: NotificationType): string {
  switch (type) {
    case "contribution_received":
      return "Contribution Received";
    case "payout_distributed":
      return "Payout Distributed";
    case "dispute_raised":
      return "Dispute Raised";
    case "member_joined":
      return "Member Joined";
    case "round_started":
      return "Round Started";
    default:
      return "Notification";
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  // Hydrate from localStorage on mount
  useEffect(() => {
    setNotifications(loadNotifications());
  }, []);

  // Persist whenever notifications change (skip initial empty render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveNotifications(notifications);
  }, [notifications]);

  // ------- WebSocket / SSE connection -------
  const connectWs = useCallback(() => {
    // If running without a real WS server, EventSource (SSE) can be used instead.
    // This implementation uses WebSocket but falls back gracefully.
    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as {
            type: NotificationType;
            message: string;
            groupId?: number;
          };

          const notification: Notification = {
            id: generateId(),
            type: data.type,
            title: labelForType(data.type),
            message: data.message,
            timestamp: Date.now(),
            read: false,
            groupId: data.groupId,
          };

          setNotifications((prev) =>
            [notification, ...prev].slice(0, MAX_NOTIFICATIONS),
          );
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Auto-reconnect after 5 seconds
        reconnectTimer.current = setTimeout(connectWs, 5000);
      };

      ws.onerror = () => {
        ws.close();
      };

      wsRef.current = ws;
    } catch {
      // WebSocket not available — degrade gracefully
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connectWs();

    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connectWs]);

  // ------- Actions -------
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
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
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
