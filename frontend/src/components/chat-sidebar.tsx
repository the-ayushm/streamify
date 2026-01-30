
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DropdownMenuAvatar } from './setting-menu'

interface ChatItem {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
}

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    avatar: 'SA',
    lastMessage: 'Sounds good! See you tomorrow at 3 PM.',
    timestamp: '10m',
    unread: 2,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'MJ',
    lastMessage: 'I sent you the project files',
    timestamp: '2h',
    unread: 0,
  },
  {
    id: '3',
    name: 'Emily Chen',
    avatar: 'EC',
    lastMessage: 'Thanks for your help earlier!',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'DW',
    lastMessage: 'Let\'s catch up soon',
    timestamp: '2 days',
    unread: 5,
  },
  {
    id: '5',
    name: 'Jessica Lee',
    avatar: 'JL',
    lastMessage: 'Perfect! Everything is set.',
    timestamp: '3 days',
    unread: 0,
  },
  {
    id: '6',
    name: 'Chris Martinez',
    avatar: 'CM',
    lastMessage: 'Great work on the presentation',
    timestamp: '1 week',
    unread: 0,
  },
]

export function ChatSidebar({
  onSelectChat,
  activeChat,
}: {
  onSelectChat: (id: string) => void
  activeChat: string | null
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border p-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button
          size="icon"
          className="h-8 w-8 rounded-full bg-sidebar-primary hover:opacity-90"
          onClick={() => console.log('New chat')}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="border-b border-sidebar-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chats search..."
            className="pl-9 bg-sidebar-accent text-sidebar-foreground border-sidebar-border placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-3">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                'w-full rounded-lg p-3 transition-all duration-200 text-left hover:bg-sidebar-accent hover:scale-[1.02] hover:translate-x-1',
                activeChat === chat.id && 'bg-sidebar-accent scale-[1.01]'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {chat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {chat.unread > 0 && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      {chat.unread}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm">{chat.name}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Sidebar Footer (Logged-in User) */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenuAvatar
          name="Ayush Kesharwani"
          email="ayush@example.com"
          avatarFallback="AK"
        />
      </div>

    </div>
  )
}
