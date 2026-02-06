
import React from "react"

import { Button } from './../components/ui/button'
import { Input } from './../components/ui/input'
import { Smile, Paperclip, Mic, Send } from 'lucide-react'
import { useState } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border/30 bg-card p-4 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 shadow-lg shadow-border/40 transition-all duration-200">
        {/* Emoji button */}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-accent/10 text-foreground shrink-0 transition-all hover:scale-110"
          aria-label="Emoji picker"
        >
          <Smile className="h-5 w-5" />
        </Button>

        {/* Attachment button */}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-accent/10 text-foreground shrink-0 transition-all hover:scale-110"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Input */}
        <Input
          placeholder="Enter message..."
          className="flex-1 bg-transparent text-foreground border-0 placeholder:text-muted-foreground/50 h-6 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Microphone button */}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-accent/10 text-foreground shrink-0 transition-all hover:scale-110"
          aria-label="Voice note"
        >
          <Mic className="h-5 w-5" />
        </Button>

        {/* Send button */}
        <Button
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-primary/40"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
