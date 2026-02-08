
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DropdownMenuAvatar } from './setting-menu'
import { useAuth } from '@/context/AuthContext'
import { ModeToggle } from "./mode-toggle"


interface ChatItem {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
}


export function ChatSidebar({
  onSelectChat,
  activeChat,
  users
}: {
  onSelectChat: (id: string) => void
  activeChat: string | null
  users: any[]
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth();
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectChat(user.id)}
              className={cn(
                'w-full rounded-lg p-3 transition-all duration-200 text-left hover:bg-sidebar-accent hover:scale-[1.02] hover:translate-x-1',
                activeChat === user.id && 'bg-sidebar-accent scale-[1.01]'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {user.unread > 0 && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {user.unread}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm">{user.fullName}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {user.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.lastMessage}
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
          name={user?.name || user?.fullName || 'User'}
          email={user?.email || 'No email'}
          avatarFallback={
            user?.name || user?.fullName
              ? (user.name || user.fullName).charAt(0).toUpperCase()
              : 'U'
          }
        />
      </div>

    </div>
  )
}
