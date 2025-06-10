import React from 'react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoicePlayer } from './VoicePlayer';
import type { ChatMessagesProps } from './types';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full gap-3 p-4",
              message.role === 'assistant' ? "bg-muted/50" : ""
            )}
          >
            <Avatar className="h-8 w-8">
              <div className={cn(
                "h-full w-full flex items-center justify-center",
                message.role === 'assistant' ? "bg-primary" : "bg-secondary"
              )}>
                {message.role === 'assistant' ? 'AI' : 'U'}
              </div>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
              
              <p className="text-sm leading-relaxed">
                {message.content}
              </p>

              {message.role === 'assistant' && message.audioUrl && (
                <div className="mt-2">
                  <VoicePlayer
                    audioUrl={message.audioUrl}
                    onPlaybackStart={message.onPlaybackStart}
                    onPlaybackEnd={message.onPlaybackEnd}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}; 