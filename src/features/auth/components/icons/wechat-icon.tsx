import React from 'react';

interface WeChatIconProps {
  className?: string;
}

export function WeChatIcon({ className = "w-5 h-5" }: WeChatIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.5 12.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5S7 10.2 7 11s.7 1.5 1.5 1.5zm7 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5S14 10.2 14 11s.7 1.5 1.5 1.5z"/>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2.1.6 4.1 1.7 5.8L2 22l4.2-1.7c1.7 1.1 3.7 1.7 5.8 1.7 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.9 1 1-3.9-.2-.4C2.5 13.5 2 11.8 2 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/>
    </svg>
  );
}
