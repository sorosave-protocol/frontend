"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/app/providers";
import { shortenAddress } from "@sorosave/sdk";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  signature: string;
}

interface GroupChatProps {
  groupId: number;
  members: string[];
  isOpen: boolean;
  onClose: () => void;
}

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function signMessage(text: string, sender: string): string {
  const payload = `${sender}:${text}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) - hash + payload.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function getStorageKey(groupId: number): string {
  return `sorosave-chat-${groupId}`;
}

function loadMessages(groupId: number): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(groupId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(groupId: number, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  const recent = messages.slice(-200);
  localStorage.setItem(getStorageKey(groupId), JSON.stringify(recent));
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return time;
  return `${d.getMonth() + 1}/${d.getDate()} ${time}`;
}

export function GroupChat({ groupId, members, isOpen, onClose }: GroupChatProps) {
  const { address, isConnected } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages on mount and poll for updates
  useEffect(() => {
    setMessages(loadMessages(groupId));
    const interval = setInterval(() => {
      setMessages(loadMessages(groupId));
    }, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !address) return;

    const msg: ChatMessage = {
      id: generateMessageId(),
      sender: address,
      text,
      timestamp: Date.now(),
      signature: signMessage(text, address),
    };

    const updated = [...loadMessages(groupId), msg];
    saveMessages(groupId, updated);
    setMessages(updated);
    setInput("");
  }, [input, address, groupId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMember = address ? members.includes(address) : false;

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl border-l dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 bg-primary-600">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-white font-semibold text-sm">Group Chat</h3>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {members.length} members
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.sender === address;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${isOwn ? "order-1" : ""}`}>
                {!isOwn && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 px-1">
                    {shortenAddress(msg.sender)}
                  </p>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm break-words ${
                    isOwn
                      ? "bg-primary-600 text-white rounded-br-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 px-1 ${isOwn ? "justify-end" : ""}`}>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {formatTime(msg.timestamp)}
                  </span>
                  <span className="text-[10px] text-gray-300 dark:text-gray-600" title={`sig: ${msg.signature}`}>
                    ✓
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t dark:border-gray-700 px-3 py-2">
        {!isConnected ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
            Connect wallet to chat
          </p>
        ) : !isMember ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
            Join the group to chat
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
