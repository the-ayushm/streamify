import { useEffect, useState } from 'react'
import { ChatSidebar } from './../../components/chat-sidebar'
import { ChatHeader } from './../../components/chat-header'
import { ChatArea } from './../../components/chat-area'
import { ChatInput } from './../../components/chat-input'
import { useIsMobile } from '@/hooks/use-mobile'
import api from './../../api.js'
import { useAuth } from '@/context/AuthContext'
import { socket } from "@/lib/socket"
import { formatMessage } from '@/utils/formatMessage'

export default function Home() {
  const isMobile = useIsMobile();
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { user } = useAuth();
  const loggedInUserId = user?._id;

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await api.get('/api/users/sidebarUsers', { withCredentials: true });
        setChatUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch chat users:', error);
      }
    };
    fetchChatUsers();
  }, [])

  const handleSelectChat = async (user: any) => {
    try {
      const res = await api.post(`/api/conversation/${user._id}`, {}, { withCredentials: true });
      setSelectedUser(user);
      setConversationId(res.data.conversationId);
    } catch (err) {
      console.error("Failed to open conversation! ", err)
    }
  }

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true)
        const res = await api.get(`/api/messages/${conversationId}`, { withCredentials: true });
        const formattedMessages = res.data.map((msg: any) => formatMessage(msg, loggedInUserId, selectedUser));
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [conversationId, loggedInUserId, selectedUser]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;
    try {
      const res = await api.post('/api/messages', {
        conversationId,
        text
      })
      const newMessage = res.data;
      const formattedMessage = formatMessage(newMessage, loggedInUserId, selectedUser);
      setMessages((prev) => [...prev, formattedMessage])
      socket.emit("send-message", {
        conversationId,
        message: newMessage,
      })
    } catch (err) {
      console.error("Failed to send messages! ", err);
    }
  }

  useEffect(() => {
    if (!loggedInUserId) return
    if (!socket.connected) {
      socket.connect()
    }
    return () => {
      socket.disconnect()
    }
  }, [loggedInUserId])

  useEffect(() => {
    if (!conversationId) return
    socket.emit("join-room", conversationId)
    return () => {
      socket.emit("leave-room", conversationId)
    }
  }, [conversationId])

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      const formattedMessage = formatMessage(msg, loggedInUserId, selectedUser);
      setMessages((prev) => [...prev, formattedMessage])
    })
    return () => {
      socket.off("receive-message")
    }
  }, [loggedInUserId, selectedUser])

  return (
    <main className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`w-80 shrink-0 overflow-hidden ${isMobile ? (selectedUser ? 'hidden' : 'flex w-full') : 'hidden md:flex'
        }  `}>
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={selectedUser} users={chatUsers} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedUser ? (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-lg text-muted-foreground">
              Select a user to chat
            </h1>
          </div>
        ) : (
          <>
            <ChatHeader
              name={selectedUser.fullName}
              avatar={selectedUser.fullName.charAt(0)}
              isOnline={false}
              onBack={isMobile ? () => setSelectedUser(null) : undefined}
            />
            <ChatArea messages={messages} isLoading={isLoadingMessages} />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </main>
  )
}
