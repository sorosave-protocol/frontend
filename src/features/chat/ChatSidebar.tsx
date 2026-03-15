import React, { useState, useEffect } from 'react';
import { XmtpClient, Message } from '@xmtp/xmtp-js';

const ChatSidebar = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const client = await XmtpClient.connect();
        const conversation = await client.conversations.newConversation('recipientAddress');
        const messages = await conversation.messages();
        setMessages(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="chat-sidebar">
      <h2>Messages</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className="message-item">
              <p>{message.sender}</p>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
