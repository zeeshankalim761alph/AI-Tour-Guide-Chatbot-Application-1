import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';
import { GroundingChip } from './GroundingChip';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md ${
          isUser ? 'bg-travel-600 text-white' : 'bg-white text-travel-600'
        }`}>
          <i className={`fa-solid ${isUser ? 'fa-user' : 'fa-plane-departure'}`}></i>
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
              isUser
                ? 'bg-travel-600 text-white rounded-tr-none'
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}
          >
            <div className={`markdown-body ${isUser ? 'text-white' : ''}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>

          {/* Grounding Chips (Maps/Web) */}
          {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-3 flex flex-wrap">
              {message.groundingChunks.map((chunk, idx) => (
                <GroundingChip key={idx} chunk={chunk} />
              ))}
            </div>
          )}
          
          {/* Timestamp */}
          <span className="text-xs text-gray-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};