"use client";

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

interface GroupChatProps {
  groupId: number;
  walletAddress: string;
}

export function GroupChat({ groupId, walletAddress }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      connectChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectChat = async () => {
    // Mock XMTP connection - replace with actual XMTP SDK
    setIsConnected(true);
    
    // Load mock messages
    const mockMessages: Message[] = [
      { id: '1', sender: 'GABC123...', content: 'Hey everyone! Ready for this cycle?', timestamp: Date.now() - 3600000 },
      { id: '2', sender: 'GDEF456...', content: 'Yes! Just contributed.', timestamp: Date.now() - 1800000 },
      { id: '3', sender: 'GHIJ789...', content: 'Same here. Excited!', timestamp: Date.now() - 600000 },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: walletAddress.slice(0, 8) + '...',
      content: newMessage,
      timestamp: Date.now(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // Here you would actually send via XMTP
    // await xmtpClient.sendMessage(groupId.toString(), newMessage);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatAddress = (address: string) => {
    return address.length > 12 ? address.slice(0, 6) + '...' + address.slice(-4) : address;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
        data-tour="group-chat"
      >
        💬
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>

      {/* Chat Sidebar */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-40">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Group Chat</h3>
              <p className="text-xs text-gray-500">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.sender === walletAddress.slice(0, 8) + '...' || 
                           msg.sender === formatAddress(walletAddress);
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      isOwn
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-xs opacity-70 mb-1">{msg.sender}</p>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
