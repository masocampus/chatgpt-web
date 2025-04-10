'use client';

import { useChat } from 'ai/react';
import { cn } from '@/lib/utils'; // Import cn utility from Shadcn setup
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import AvatarImage
import { useEffect, useRef } from 'react';
import { ArrowLeft, Video, Phone, Mic, Send } from 'lucide-react'; // Import necessary icons

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  // Ref for scroll area to auto-scroll to bottom
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 px-[150px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Larry Machigo" /> {/* Placeholder */}
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Masocampus</p> {/* Placeholder Name */}
            <p className="text-xs text-indigo-200">Online</p>
          </div>
        </div>
      </div>

      {/* Message List using ScrollArea */}
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex items-end gap-2', // Use items-end for better alignment with avatar
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {/* AI Avatar on the left */}
                {m.role === 'assistant' && (
                   <Avatar className="h-8 w-8">
                     {/* <AvatarImage src="/path/to/ai-avatar.png" alt="AI Avatar" /> */}
                     <AvatarFallback className="bg-indigo-100 text-indigo-700">AI</AvatarFallback>
                   </Avatar>
                )}

                 <div
                  className={cn(
                    'whitespace-pre-wrap rounded-xl px-4 py-2 max-w-[70%]', // Increased max-width, adjusted rounding
                    m.role === 'user'
                      ? 'bg-white text-gray-900 rounded-br-none shadow-sm' // White bubble for user, different rounding
                      : 'bg-indigo-600 text-white rounded-bl-none shadow-sm' // Purple bubble for AI, different rounding
                  )}
                >
                  {m.content}
                </div>

                 {/* User Avatar on the right */}
                 {m.role === 'user' && (
                   <Avatar className="h-8 w-8">
                     {/* <AvatarImage src="/path/to/user-avatar.png" alt="User Avatar" /> */}
                     <AvatarFallback className="bg-gray-200 text-gray-700">U</AvatarFallback>
                   </Avatar>
                 )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">메시지를 입력하여 대화를 시작하세요.</p>
          )}
        </div>
      </ScrollArea>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 p-3 bg-white border-t">
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:bg-gray-100" type="button">
           <Mic className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ok. Let me check" // Placeholder text from image
          disabled={isLoading}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent" // Simplified input style
        />
        <Button
          type="submit"
          disabled={isLoading}
          size="icon"
          className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 m-4 p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg max-w-sm">
          <p className="font-semibold mb-2">오류 발생:</p>
          <pre className="text-sm whitespace-pre-wrap break-words">{error.message}</pre>
        </div>
      )}
    </div>
  );
} 