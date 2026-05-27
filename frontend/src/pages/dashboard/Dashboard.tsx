import { useEffect, useRef, useState } from 'react'
import { ChatSidebar } from './../../components/chat-sidebar'
import { ChatHeader } from './../../components/chat-header'
import { ChatArea } from './../../components/chat-area'
import { ChatInput } from './../../components/chat-input'
import { useIsMobile } from '@/hooks/use-mobile'
import api from './../../api.js'
import { useAuth } from '@/context/AuthContext'
import { socket } from "@/lib/socket"
import { formatMessage } from '@/utils/formatMessage'
import VideoCallModal from '@/components/VideoCallModal'

export default function Home() {
  const isMobile = useIsMobile();
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { user } = useAuth();
  const loggedInUserId = user?._id;

  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

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

    if (!loggedInUserId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const registerUser = () => {

      console.log("Registering user:", loggedInUserId);

      socket.emit("register-user", loggedInUserId);

    };

    // If already connected
    if (socket.connected) {
      registerUser();
    }

    // On future reconnects
    socket.on("connect", registerUser);

    return () => {
      socket.off("connect", registerUser);
    };

  }, [loggedInUserId]);

  useEffect(() => {
    if (!conversationId) return
    socket.emit("join-room", conversationId)
    socket.emit("message-read", conversationId)
    return () => {
      socket.emit("leave-room", conversationId)
    }
  }, [conversationId])

  useEffect(() => {
    const handleReceive = (msg: any) => {
      const formattedMessage = formatMessage(msg, loggedInUserId, selectedUser);
      setMessages((prev) => [...prev, formattedMessage])

      socket.emit("message-delivered", {
        messageId: msg._id,
        conversationId: msg.conversationId,
      })

      if (conversationId === msg.conversationId) {
        socket.emit("message-read", msg.conversationId);
      }
    }

    const handleDeliveredUpdate = ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDelivered: true } : m))
    }

    const handleReadUpdate = ({ conversationId: convId }: { conversationId: string }) => {
      setMessages(prev => prev.map(m => m.conversationId === convId ? { ...m, isRead: true } : m))
    }

    socket.on("receive-message", handleReceive)
    socket.on("message-delivered-update", handleDeliveredUpdate)
    socket.on("message-read-update", handleReadUpdate)

    return () => {
      socket.off("receive-message", handleReceive)
      socket.off("message-delivered-update", handleDeliveredUpdate)
      socket.off("message-read-update", handleReadUpdate)
    }
  }, [loggedInUserId, selectedUser])

  useEffect(() => {

    const handleOnlineUsers = (users: string[]) => {

      console.log("ONLINE USERS:", users);

      setOnlineUsers(users);

    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };

  }, []);

  useEffect(() => {

    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    socket.on("user-typing", handleTyping);

    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };

  }, []);

  useEffect(() => {
    const handleIncomingCall = ({ offer, caller }) => {
      console.log("Incoming call from:", caller);
      setIncomingCall({
        offer,
        caller
      });
    };
    socket.on("incoming-call", handleIncomingCall);
    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, []);

  useEffect(() => {
    const handleCallAnswered = async ({ answer }) => {
      console.log("Call answered");
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      )
    }
    socket.on("call-answered", handleCallAnswered)
    return () => {
      socket.off("call-answered", handleCallAnswered)
    }
  }, [])

  useEffect(() => {
    const handleIceCandidate = async ({ candidate }) => {
      console.log("ICE candidate received");
      if (peerConnection.current && candidate) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        )
      }
    }
    socket.on("ice-candidate", handleIceCandidate)
    return () => {
      socket.off("ice-candidate", handleIceCandidate)
    }
  }, [])

 const startCall = async () => {
  try {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: selectedUser._id,
          candidate: event.candidate
        });
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localStream.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      await localVideoRef.current.play();
    }

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current?.play()
            .then(() => console.log("REMOTE VIDEO PLAYING"))
            .catch((err) => console.log("PLAY ERROR:", err));
        };
      }
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("call-user", {
      to: selectedUser._id,
      offer,
      caller: { id: loggedInUserId, name: user.fullName }
    });

    // ✅ Sab kuch successful hone ke BAAD hi UI update karo
    setIsInCall(true);

  } catch (error) {
    console.error("Failed to start call:", error);

    // ✅ Failure pe cleanup karo
    localStream.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    peerConnection.current = null;
    localStream.current = null;
    setIsInCall(false); // ensure UI reset
  }
};

  const acceptCall = async () => {
    const currentCall = incomingCall;
    setIncomingCall(null)

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsInCall(true);
    localStream.current = stream

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    })

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: currentCall.caller.id,
          candidate: event.candidate
        })
      }
    }

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream)
    })

    peerConnection.current.ontrack = (event) => {

      console.log("Remote stream received");

      const remoteStream = event.streams[0];

      if (
        remoteVideoRef.current &&
        remoteStream
      ) {

        remoteVideoRef.current.srcObject = remoteStream;

        remoteVideoRef.current.onloadedmetadata = () => {

          remoteVideoRef.current?.play()
            .then(() => {
              console.log("REMOTE VIDEO PLAYING");
            })
            .catch((err) => {
              console.log("PLAY ERROR:", err);
            });

        };

      }

    };

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    )

    const answer = await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)

    socket.emit("answer-call", {
      to: incomingCall.caller.id,
      answer
    })
  }

  const endCall = () => {
    localStream.current?.getTracks().forEach((track) => {
      track.stop()
    })
    peerConnection.current?.close();
    peerConnection.current = null;
    setIsInCall(false);

  }

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
              isOnline={onlineUsers.includes(selectedUser._id)}
              isTyping={isTyping}
              onBack={isMobile ? () => setSelectedUser(null) : undefined}
              onVideoCall={startCall}
            />
            <ChatArea messages={messages} isLoading={isLoadingMessages} />
            <ChatInput onSendMessage={handleSendMessage} conversationId={conversationId} />
          </>
        )}
      </div>

      {
        isInCall && (

          <VideoCallModal
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            onEndCall={endCall}
          />

        )
      }

      {incomingCall && (
        <div className="fixed top-10 left-10 bg-black text-white p-4 rounded-xl z-50">
          Incoming Call from {incomingCall.caller.name}
          <button
            onClick={acceptCall}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Accept
          </button>
        </div>
      )}

    </main>
  )
}