import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './chat-message'
import { useEffect, useRef } from 'react'

interface Message {
  _id: string
  content: string
  image?: string
  timestamp: string
  isSent: boolean
  isRead?: boolean
  senderName: string
  senderAvatar: string
}

interface ChatAreaProps {
  messages?: Message[];
  isLoading?: boolean;
}

export function ChatArea({ messages = [], isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const getIsConsecutive = (current: Message, previous: Message | undefined) => {
    return previous && current.senderName === previous.senderName && current.isSent === previous.isSent
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages]);

// 🔹 LOADING STATE (this fixes the flicker)
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Loading messages...
      </div>
    )
  }

  // 🔹 EMPTY STATE: no messages yet
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        📭 No messages yet. Say hi 👋
      </div>
    )
  }
  return (
    <ScrollArea className="flex-1 bg-background overflow-hidden">
      <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : undefined
          const isConsecutive = getIsConsecutive(message, previousMessage)

          return (
            <ChatMessage
              key={message._id}
              id={message._id}
              content={message.content}
              timestamp={message.timestamp}
              isSent={message.isSent}
              senderName={message.senderName || 'Unknown'}
              senderAvatar={message.senderAvatar || 'U'}
              isConsecutive={isConsecutive}
            />
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
