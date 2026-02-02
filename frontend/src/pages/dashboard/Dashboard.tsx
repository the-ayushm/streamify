import { useState } from 'react'
import { ChatSidebar } from './../../components/chat-sidebar'
import { ChatHeader } from './../../components/chat-header'
import { ChatArea } from './../../components/chat-area'
import { ChatInput } from './../../components/chat-input'
import { useIsMobile } from '@/hooks/use-mobile'

const chatUsers = {
  '1': { name: 'Sarah Anderson', avatar: 'SA', isOnline: true },
  '2': { name: 'Mike Johnson', avatar: 'MJ', isOnline: false },
  '3': { name: 'Emily Chen', avatar: 'EC', isOnline: true },
  '4': { name: 'David Wilson', avatar: 'DW', isOnline: true },
  '5': { name: 'Jessica Lee', avatar: 'JL', isOnline: false },
  '6': { name: 'Chris Martinez', avatar: 'CM', isOnline: true },
}

const mockMessages = {
  '1': [
    {
      id: '1',
      content: 'Hey! How are you doing?',
      timestamp: '10:30 AM',
      isSent: false,
      isRead: true,
      senderName: 'Sarah Anderson',
      senderAvatar: 'SA',
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished the project.',
      timestamp: '10:32 AM',
      isSent: true,
      isRead: true,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
    {
      id: '3',
      content: 'That\'s awesome! Can\'t wait to see it.',
      timestamp: '10:33 AM',
      isSent: false,
      isRead: true,
      senderName: 'Sarah Anderson',
      senderAvatar: 'SA',
    },
    {
      id: '4',
      content: 'I\'ll send you the files tomorrow morning',
      timestamp: '10:34 AM',
      isSent: true,
      isRead: true,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
    {
      id: '5',
      content: 'Sounds good! See you tomorrow at 3 PM.',
      timestamp: '10:35 AM',
      isSent: false,
      isRead: true,
      senderName: 'Sarah Anderson',
      senderAvatar: 'SA',
    },
  ],
  '2': [
    {
      id: '1',
      content: 'Did you get a chance to review the docs?',
      timestamp: '2:15 PM',
      isSent: false,
      isRead: true,
      senderName: 'Mike Johnson',
      senderAvatar: 'MJ',
    },
    {
      id: '2',
      content: 'Yes, I read through them. Great work!',
      timestamp: '2:20 PM',
      isSent: true,
      isRead: false,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
    {
      id: '3',
      content: 'I sent you the project files',
      timestamp: '2:45 PM',
      isSent: false,
      isRead: true,
      senderName: 'Mike Johnson',
      senderAvatar: 'MJ',
    },
  ],
  '3': [
    {
      id: '1',
      content: 'Thank you so much for your help!',
      timestamp: 'Yesterday',
      isSent: false,
      isRead: true,
      senderName: 'Emily Chen',
      senderAvatar: 'EC',
    },
    {
      id: '2',
      content: 'No problem, happy to help!',
      timestamp: 'Yesterday',
      isSent: true,
      isRead: true,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
    {
      id: '3',
      content: 'Thanks for your help earlier!',
      timestamp: 'Yesterday',
      isSent: false,
      isRead: true,
      senderName: 'Emily Chen',
      senderAvatar: 'EC',
    },
  ],
  '4': [
    {
      id: '1',
      content: 'Hey, long time no chat!',
      timestamp: '2 days ago',
      isSent: false,
      isRead: true,
      senderName: 'David Wilson',
      senderAvatar: 'DW',
    },
    {
      id: '2',
      content: 'Yeah! We should catch up soon',
      timestamp: '2 days ago',
      isSent: true,
      isRead: true,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
    {
      id: '3',
      content: 'Let\'s catch up soon',
      timestamp: '2 days ago',
      isSent: false,
      isRead: true,
      senderName: 'David Wilson',
      senderAvatar: 'DW',
    },
  ],
  '5': [
    {
      id: '1',
      content: 'Everything is set up',
      timestamp: '3 days ago',
      isSent: false,
      isRead: true,
      senderName: 'Jessica Lee',
      senderAvatar: 'JL',
    },
    {
      id: '2',
      content: 'Perfect! Everything is set.',
      timestamp: '3 days ago',
      isSent: true,
      isRead: true,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
  ],
  '6': [
    {
      id: '1',
      content: 'Your presentation was fantastic!',
      timestamp: '1 week ago',
      isSent: false,
      isRead: true,
      senderName: 'Chris Martinez',
      senderAvatar: 'CM',
    },
    {
      id: '2',
      content: 'Thank you so much!',
      timestamp: '1 week ago',
      isSent: true,
      isRead: true,
      senderName: 'You',
      senderAvatar: 'YOU',
    },
    {
      id: '3',
      content: 'Great work on the presentation',
      timestamp: '1 week ago',
      isSent: false,
      isRead: true,
      senderName: 'Chris Martinez',
      senderAvatar: 'CM',
    },
  ],
}

export default function Home() {
  const isMobile = useIsMobile();
  const [activeChat, setActiveChat] = useState<string | null>(isMobile ? null : '1')
  const [messages, setMessages] = useState(
    mockMessages['1' as keyof typeof mockMessages] || []
  )

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId)
    setMessages(mockMessages[chatId as keyof typeof mockMessages] || [])
  }

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: String(messages.length + 1),
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSent: true,
      isRead: false,
      senderName: 'You',
      senderAvatar: 'YOU',
    }
    setMessages([...messages, newMessage])
  }

  const currentUser =
    chatUsers[activeChat as keyof typeof chatUsers] || chatUsers['1']

  return (
    <main className="flex h-screen overflow-hidden bg-background dark">
      {/* Sidebar */}
      <div className={`w-80 flex-shrink-0 overflow-hidden ${isMobile ? (activeChat ? 'hidden' : 'flex') : 'hidden md:flex'
        }  `}>
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={activeChat} />
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex-col overflow-hidden ${
        isMobile ? (activeChat ? 'flex' : 'hidden') : 'flex'
      }`}>
        <ChatHeader {...currentUser} onBack = {isMobile ? () => setActiveChat(null) : undefined}/>
        <ChatArea messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  )
}
