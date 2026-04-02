"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications, type Notification } from "./NotificationProvider";

// ---------------------------------------------------------------------------
// Icon components
// ---------------------------------------------------------------------------

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

const typeIcons: Record<string, string> = {
  contribution_received: "Contribution",
  payout_distributed: "Payout",
  dispute_raised: "Dispute",
  member_joined: "Member",
  round_started: "Round",
};

const typeColors: Record<string, string> = {
  contribution_received: "bg-green-100 text-green-800",
  payout_distributed: "bg-blue-100 text-blue-800",
  dispute_raised: "bg-red-100 text-red-800",
  member_joined: "bg-purple-100 text-purple-800",
  round_started: "bg-yellow-100 text-yellow-800",
};

function relativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// NotificationItem
// ---------------------------------------------------------------------------

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onRead(notification.id)}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
        notification.read ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <span
          className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
            typeColors[notification.type] || "bg-gray-100 text-gray-800"
          }`}
        >
          {typeIcons[notification.type] || "Info"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {relativeTime(notification.timestamp)}
          </p>
        </div>
        {!notification.read && (
          <span className="mt-1 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// NotificationBell (main export)
// ---------------------------------------------------------------------------

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[420px] bg-white rounded-xl shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-gray-300"
                }`}
                title={isConnected ? "Connected" : "Disconnected"}
              />
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={markAsRead}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
