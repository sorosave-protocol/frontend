"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { shortenAddress } from "@sorosave/sdk";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  signature?: string;
}

interface GroupChatProps {
  groupId: number;
  members: string[];
  currentUser: string;
}

// Simple in-memory message store (replace with Gun.js or backend in production)
const messageStore: Record<number, Message[]> = {};
const listeners: Record<number, ((msgs: Message[]) => void)[]> = {};

const notifyListeners = (groupId: number) => {
  if (listeners[groupId]) {
    listeners[groupId].forEach((cb) => cb(messageStore[groupId] || []));
  }
};

export function GroupChat({ groupId, members, currentUser }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to messages
  useEffect(() => {
    // Initialize store for this group
    if (!messageStore[groupId]) {
      messageStore[groupId] = [];
    }

    // Add listener
    if (!listeners[groupId]) {
      listeners[groupId] = [];
    }
    const listener = (msgs: Message[]) => setMessages([...msgs]);
    listeners[groupId].push(listener);

    // Initial sync
    setMessages([...messageStore[groupId]]);

    return () => {
      listeners[groupId] = listeners[groupId].filter((l) => l !== listener);
    };
  }, [groupId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling for cross-tab sync (simulating real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = messageStore[groupId] || [];
      if (stored.length !== messages.length) {
        setMessages([...stored]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [groupId, messages.length]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !currentUser) return;

    setIsLoading(true);

    try {
      // Create message with mock signature (in production, sign with wallet)
      const newMessage: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: currentUser,
        content: inputValue.trim(),
        timestamp: Date.now(),
        signature: `sig_${Math.random().toString(36).substr(2, 16)}`,
      };

      // Add to store
      if (!messageStore[groupId]) {
        messageStore[groupId] = [];
      }
      messageStore[groupId].push(newMessage);

      // Notify all listeners
      notifyListeners(groupId);

      // Clear input
      setInputValue("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, currentUser, groupId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCurrentUser = (sender: string) =>
    sender.toLowerCase() === currentUser.toLowerCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Group Chat</h3>
        <span className="text-sm text-gray-500">{members.length} members</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                isCurrentUser(msg.sender) ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  isCurrentUser(msg.sender)
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {!isCurrentUser(msg.sender) && (
                  <p className="text-xs font-medium opacity-75 mb-1">
                    {shortenAddress(msg.sender)}
                  </p>
                )}
                <p className="text-sm break-words">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isCurrentUser(msg.sender)
                      ? "text-primary-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentUser ? "Type a message..." : "Connect wallet to chat"
            }
            disabled={!currentUser || isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !currentUser || isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              "Send"
            )}
          </button>
        </div>
        {currentUser && (
          <p className="text-xs text-gray-500 mt-2">
            Sending as {shortenAddress(currentUser)}
          </p>
        )}
      </div>
    </div>
  );
}
