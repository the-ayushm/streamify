
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Phone, Video, MoreVertical, User, Archive, Ban, Trash2, ArrowLeftCircleIcon } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

interface ChatHeaderProps {
  name?: string
  avatar?: string
  isOnline?: boolean
  onBack?: () => void
}

export function ChatHeader({ name, avatar, isOnline, onBack }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 bg-card p-4 backdrop-blur-sm shrink-0 h-20">
      {/* Left side - User info */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full flex md:hidden"
            onClick={onBack}
            aria-label="Go back to chats"
          >
            <ArrowLeftCircleIcon className="h-5 w-5" />
          </Button>
        )}
        <div className="relative">

          <Avatar className="h-12 w-12 ring-2 ring-border/30">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {avatar}
            </AvatarFallback>
          </Avatar>

          {isOnline && (
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card shadow-lg shadow-green-500/50" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{name}</h2>
          <p className="text-xs text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-accent/10 text-foreground transition-colors"
                aria-label="Voice call"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice call</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-accent/10 text-foreground transition-colors"
                aria-label="Video call"
              >
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video call</TooltipContent>
          </Tooltip>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-accent/10 text-foreground transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                <span>View profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Archive className="h-4 w-4" />
                <span>Archive chat</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Ban className="h-4 w-4" />
                <span>Block user</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span>Delete chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    </div>
  )
}
