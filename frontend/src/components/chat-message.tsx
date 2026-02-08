import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, CheckCheck } from 'lucide-react'

interface ChatMessageProps {
  id: string
  content: string
  image?: string
  timestamp: string
  isSent: boolean
  isRead?: boolean
  senderName: string
  senderAvatar: string
  isConsecutive?: boolean
}

export function ChatMessage({
  content,
  image,
  timestamp,
  isSent,
  isRead,
  senderName,
  senderAvatar,
  isConsecutive = false,
}: ChatMessageProps) {
  
  return (
    <div
      className={`flex gap-3 ${isSent ? 'flex-row-reverse' : 'flex-row'} ${isConsecutive ? '-mt-2' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {!isSent && (
        <Avatar className={`h-8 w-8 shrink-0 ${isConsecutive ? 'opacity-0' : 'opacity-100'}`}>
          {/* <AvatarImage src="/placeholder.svg" /> */}
          <AvatarFallback className="bg-accent text-accent-foreground text-xs">
            {senderAvatar}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 ${isSent ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2 max-w-xs lg:max-w-md shadow-sm transition-all ${
            isSent
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground'
          }`}
        >
          {image && (
            <div className="mb-2 rounded-lg overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt="Message image"
                className="h-48 w-48 object-cover"
              />
            </div>
          )}
          <p className="text-sm wrap-break-word">{content}</p>
        </div>

        {/* Timestamp and read status */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground/70 font-light">{timestamp}</span>
          {isSent && (
            <>
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-accent" />
              ) : (
                <Check className="h-3 w-3 text-muted-foreground/50" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
