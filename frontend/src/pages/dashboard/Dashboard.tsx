// import { useEffect, useRef, useState } from 'react'
// import { ChatSidebar } from './../../components/chat-sidebar'
// import { ChatHeader } from './../../components/chat-header'
// import { ChatArea } from './../../components/chat-area'
// import { ChatInput } from './../../components/chat-input'
// import { useIsMobile } from '@/hooks/use-mobile'
// import api from './../../api.js'
// import { useAuth } from '@/context/AuthContext'
// import { socket } from "@/lib/socket"
// import { formatMessage } from '@/utils/formatMessage'
// import VideoCallModal from '@/components/VideoCallModal'

// export default function Home() {
//   const isMobile = useIsMobile();
//   const [selectedUser, setSelectedUser] = useState<any | null>(null)
//   const [messages, setMessages] = useState<any[]>([])
//   const [chatUsers, setChatUsers] = useState<any[]>([]);
//   const [conversationId, setConversationId] = useState<string | null>(null)
//   const [isLoadingMessages, setIsLoadingMessages] = useState(false)
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([])
//   const [isTyping, setIsTyping] = useState<boolean>(false);
//   const { user } = useAuth();
//   const loggedInUserId = user?._id;

//   const [isInCall, setIsInCall] = useState(false);
//   const [incomingCall, setIncomingCall] = useState<any>(null)
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const localStream = useRef(null)

//   useEffect(() => {
//     const fetchChatUsers = async () => {
//       try {
//         const res = await api.get('/api/users/sidebarUsers', { withCredentials: true });
//         setChatUsers(res.data);
//       } catch (error) {
//         console.error('Failed to fetch chat users:', error);
//       }
//     };
//     fetchChatUsers();
//   }, [])

//   const handleSelectChat = async (user: any) => {
//     try {
//       const res = await api.post(`/api/conversation/${user._id}`, {}, { withCredentials: true });
//       setSelectedUser(user);
//       setConversationId(res.data.conversationId);
//     } catch (err) {
//       console.error("Failed to open conversation! ", err)
//     }
//   }

//   useEffect(() => {
//     if (!conversationId) return;

//     const fetchMessages = async () => {
//       try {
//         setIsLoadingMessages(true)
//         const res = await api.get(`/api/messages/${conversationId}`, { withCredentials: true });
//         const formattedMessages = res.data.map((msg: any) => formatMessage(msg, loggedInUserId, selectedUser));
//         setMessages(formattedMessages);
//       } catch (err) {
//         console.error('Failed to fetch messages:', err);
//       } finally {
//         setIsLoadingMessages(false);
//       }
//     };
//     fetchMessages();
//   }, [conversationId, loggedInUserId, selectedUser]);

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim() || !conversationId) return;
//     try {
//       const res = await api.post('/api/messages', {
//         conversationId,
//         text
//       })
//       const newMessage = res.data;
//       const formattedMessage = formatMessage(newMessage, loggedInUserId, selectedUser);
//       setMessages((prev) => [...prev, formattedMessage])
//       socket.emit("send-message", {
//         conversationId,
//         message: newMessage,
//       })
//     } catch (err) {
//       console.error("Failed to send messages! ", err);
//     }
//   }

//   useEffect(() => {

//     if (!loggedInUserId) return;

//     if (!socket.connected) {
//       socket.connect();
//     }

//     const registerUser = () => {

//       console.log("Registering user:", loggedInUserId);

//       socket.emit("register-user", loggedInUserId);

//     };

//     // If already connected
//     if (socket.connected) {
//       registerUser();
//     }

//     // On future reconnects
//     socket.on("connect", registerUser);

//     return () => {
//       socket.off("connect", registerUser);
//     };

//   }, [loggedInUserId]);

//   useEffect(() => {
//     if (!conversationId) return
//     socket.emit("join-room", conversationId)
//     socket.emit("message-read", conversationId)
//     return () => {
//       socket.emit("leave-room", conversationId)
//     }
//   }, [conversationId])

//   useEffect(() => {
//     const handleReceive = (msg: any) => {
//       const formattedMessage = formatMessage(msg, loggedInUserId, selectedUser);
//       setMessages((prev) => [...prev, formattedMessage])

//       socket.emit("message-delivered", {
//         messageId: msg._id,
//         conversationId: msg.conversationId,
//       })

//       if (conversationId === msg.conversationId) {
//         socket.emit("message-read", msg.conversationId);
//       }
//     }

//     const handleDeliveredUpdate = ({ messageId }: { messageId: string }) => {
//       setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDelivered: true } : m))
//     }

//     const handleReadUpdate = ({ conversationId: convId }: { conversationId: string }) => {
//       setMessages(prev => prev.map(m => m.conversationId === convId ? { ...m, isRead: true } : m))
//     }

//     socket.on("receive-message", handleReceive)
//     socket.on("message-delivered-update", handleDeliveredUpdate)
//     socket.on("message-read-update", handleReadUpdate)

//     return () => {
//       socket.off("receive-message", handleReceive)
//       socket.off("message-delivered-update", handleDeliveredUpdate)
//       socket.off("message-read-update", handleReadUpdate)
//     }
//   }, [loggedInUserId, selectedUser])

//   useEffect(() => {

//     const handleOnlineUsers = (users: string[]) => {

//       console.log("ONLINE USERS:", users);

//       setOnlineUsers(users);

//     };

//     socket.on("online-users", handleOnlineUsers);

//     return () => {
//       socket.off("online-users", handleOnlineUsers);
//     };

//   }, []);

//   useEffect(() => {

//     const handleTyping = () => {
//       setIsTyping(true);
//     };

//     const handleStopTyping = () => {
//       setIsTyping(false);
//     };

//     socket.on("user-typing", handleTyping);

//     socket.on("user-stop-typing", handleStopTyping);

//     return () => {
//       socket.off("user-typing", handleTyping);
//       socket.off("user-stop-typing", handleStopTyping);
//     };

//   }, []);

//   useEffect(() => {
//     const handleIncomingCall = ({ offer, caller }) => {
//       console.log("Incoming call from:", caller);
//       setIncomingCall({
//         offer,
//         caller
//       });
//     };
//     socket.on("incoming-call", handleIncomingCall);
//     return () => {
//       socket.off("incoming-call", handleIncomingCall);
//     };
//   }, []);

//   useEffect(() => {
//     const handleCallAnswered = async ({ answer }) => {
//       console.log("Call answered");
//       await peerConnection.current?.setRemoteDescription(
//         new RTCSessionDescription(answer)
//       )
//     }
//     socket.on("call-answered", handleCallAnswered)
//     return () => {
//       socket.off("call-answered", handleCallAnswered)
//     }
//   }, [])

//   useEffect(() => {
//     const handleIceCandidate = async ({ candidate }) => {
//       console.log("ICE candidate received");
//       if (peerConnection.current && candidate) {
//         await peerConnection.current.addIceCandidate(
//           new RTCIceCandidate(candidate)
//         )
//       }
//     }
//     socket.on("ice-candidate", handleIceCandidate)
//     return () => {
//       socket.off("ice-candidate", handleIceCandidate)
//     }
//   }, [])

//   const startCall = async () => {
//     try {
//       // Create peer connection
//       peerConnection.current = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: "stun:stun.l.google.com:19302"
//           }
//         ]
//       });

//       peerConnection.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("ice-candidate", {
//             to: selectedUser._id,
//             candidate: event.candidate
//           })
//         }
//       }

//       // Get camera + microphone
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });

//       setIsInCall(true);

//       console.log(
//         "LOCAL VIDEO TRACKS:",
//         stream.getVideoTracks()
//       )

//       localStream.current = stream;

//       // Show my own video
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//         await localVideoRef.current.play()
//       }

//       // Add tracks into peer connection
//       stream.getTracks().forEach((track) => {
//         peerConnection.current?.addTrack(track, stream);
//       });

//       peerConnection.current.ontrack = async (event) => {
//         console.log("Remote stream received");
//         console.log("STREAMS:", event.streams);
//         console.log(
//           "VIDEO TRACKS:",
//           event.streams[0].getVideoTracks()
//         );

//         if (remoteVideoRef.current) {

//   const remoteStream = event.streams[0];

//   remoteVideoRef.current.srcObject = remoteStream;

//   remoteVideoRef.current.muted = false;

//   remoteVideoRef.current.onloadedmetadata = async () => {
//     try {

//       await remoteVideoRef.current?.play();

//       console.log("Remote video playing");

//     } catch (err) {

//       console.log("Play error:", err);

//     }
//   };
// }

//       }

//       // create offer
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer)

//       socket.emit("call-user", {
//         to: selectedUser._id,
//         offer,
//         caller: {
//           id: loggedInUserId,
//           name: user.fullName
//         }
//       })

//       console.log("Local stream started");
//     } catch (error) {
//       console.error("Failed to start call:", error);
//     }

//   }

//   const acceptCall = async () => {
//     setIncomingCall(null)

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true
//     })
//     setIsInCall(true);
//     localStream.current = stream

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream
//     }

//     peerConnection.current = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com:19302"
//         }
//       ]
//     })

//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           to: incomingCall.caller.id,
//           candidate: event.candidate
//         })
//       }
//     }

//     stream.getTracks().forEach((track) => {
//       peerConnection.current.addTrack(track, stream)
//     })

//     peerConnection.current.ontrack = async (event) => {
//       console.log("Remote stream received");
//       console.log("STREAMS:", event.streams);
//       console.log(
//         "VIDEO TRACKS:",
//         event.streams[0].getVideoTracks()
//       );
//       if (remoteVideoRef.current) {

//   const remoteStream = event.streams[0];

//   remoteVideoRef.current.srcObject = remoteStream;

//   remoteVideoRef.current.muted = false;

//   remoteVideoRef.current.onloadedmetadata = async () => {
//     try {

//       await remoteVideoRef.current?.play();

//       console.log("Remote video playing");

//     } catch (err) {

//       console.log("Play error:", err);

//     }
//   };
// }
//     }

//     await peerConnection.current.setRemoteDescription(
//       new RTCSessionDescription(incomingCall.offer)
//     )

//     const answer = await peerConnection.current.createAnswer()
//     await peerConnection.current.setLocalDescription(answer)

//     socket.emit("answer-call", {
//       to: incomingCall.caller.id,
//       answer
//     })
//   }

//   const endCall = () => {
//     localStream.current?.getTracks().forEach((track) => {
//       track.stop()
//     })
//     peerConnection.current?.close();
//     peerConnection.current = null;
//     setIsInCall(false);

//   }

//   return (
//     <main className="flex h-screen overflow-hidden bg-background">
//       {/* Sidebar */}
//       <div className={`w-80 shrink-0 overflow-hidden ${isMobile ? (selectedUser ? 'hidden' : 'flex w-full') : 'hidden md:flex'
//         }  `}>
//         <ChatSidebar onSelectChat={handleSelectChat} activeChat={selectedUser} users={chatUsers} />
//       </div>

//       {/* Chat area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {!selectedUser ? (
//           <div className="h-full flex items-center justify-center">
//             <h1 className="text-lg text-muted-foreground">
//               Select a user to chat
//             </h1>
//           </div>
//         ) : (
//           <>
//             <ChatHeader
//               name={selectedUser.fullName}
//               avatar={selectedUser.fullName.charAt(0)}
//               isOnline={onlineUsers.includes(selectedUser._id)}
//               isTyping={isTyping}
//               onBack={isMobile ? () => setSelectedUser(null) : undefined}
//               onVideoCall={startCall}
//             />
//             <ChatArea messages={messages} isLoading={isLoadingMessages} />
//             <ChatInput onSendMessage={handleSendMessage} conversationId={conversationId} />
//           </>
//         )}
//       </div>

//       {
//         isInCall && (

//           <VideoCallModal
//             localVideoRef={localVideoRef}
//             remoteVideoRef={remoteVideoRef}
//             onEndCall={endCall}
//           />

//         )
//       }

//       {incomingCall && (
//         <div className="fixed top-10 left-10 bg-black text-white p-4 rounded-xl z-50">
//           Incoming Call from {incomingCall.caller.name}
//           <button
//             onClick={acceptCall}
//             className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
//           >
//             Accept
//           </button>
//         </div>
//       )}

//     </main>
//   )
// }

import { useEffect, useRef, useState, useCallback } from 'react'
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
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // These refs point to the <video> elements inside VideoCallModal
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteInboundStream = useRef<MediaStream | null>(null);
  const pendingRemoteStream = useRef<MediaStream | null>(null);
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

  // ─── FIX 1: Assign streams to video elements AFTER modal mounts ───────────
  // When isInCall flips to true, the modal renders and refs become valid.
  useEffect(() => {
    if (!isInCall) return;

    // Assign local stream once the modal video elements exist
    if (localVideoRef.current && localStream.current) {
      localVideoRef.current.srcObject = localStream.current;
      localVideoRef.current.play().catch(() => {});
    }

    // If remote stream arrived before modal was mounted, assign it now
    if (remoteVideoRef.current && pendingRemoteStream.current) {
      remoteVideoRef.current.srcObject = pendingRemoteStream.current;
      remoteVideoRef.current.muted = true;
      remoteVideoRef.current.play().catch(() => {});
      setRemoteStream(pendingRemoteStream.current);
      pendingRemoteStream.current = null;
    }
  }, [isInCall]);

  // ─── Helper: safely assign remote stream ─────────────────────────────────
  const assignRemoteStream = useCallback((stream: MediaStream) => {
    setRemoteStream(stream);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      // FIX 2: Keep muted=true so autoplay policy is satisfied.
      // Browser autoplay blocks unmuted video. Users can unmute manually.
      remoteVideoRef.current.muted = true;
      remoteVideoRef.current.play().catch(() => {});
    } else {
      // Modal not mounted yet — store for later
      pendingRemoteStream.current = stream;
    }
  }, []);

  const attachLocalTracks = useCallback((pc: RTCPeerConnection, stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.onended = async () => {
      try {
        console.warn("Local video track ended. Attempting camera recovery...");
        const refreshed = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const newVideoTrack = refreshed.getVideoTracks()[0];
        if (!newVideoTrack) return;

        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(newVideoTrack);
        }

        if (localStream.current) {
          localStream.current.getVideoTracks().forEach((t) => {
            try {
              t.stop();
            } catch {
              // no-op
            }
            localStream.current?.removeTrack(t);
          });
          localStream.current.addTrack(newVideoTrack);
        }

        if (localVideoRef.current && localStream.current) {
          localVideoRef.current.srcObject = localStream.current;
          localVideoRef.current.play().catch(() => {});
        }

        newVideoTrack.onended = videoTrack.onended;
        console.log("Local video track recovered and replaced");
      } catch (err) {
        console.error("Failed to recover local video track:", err);
      }
    };
  }, []);

  const flushPendingIceCandidates = useCallback(async () => {
    const pc = peerConnection.current;
    if (!pc || !pc.remoteDescription) return;

    while (pendingIceCandidates.current.length > 0) {
      const candidate = pendingIceCandidates.current.shift();
      if (!candidate) continue;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn("Failed to add queued ICE candidate:", err);
      }
    }
  }, []);

  // ─── Helper: create a configured RTCPeerConnection ───────────────────────
  const createPeerConnection = useCallback((targetUserId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: targetUserId,
          candidate: event.candidate
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("PC connection state:", pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("PC ICE state:", pc.iceConnectionState);
    };

    // FIX 3: ontrack fires with streams array — use streams[0] directly
    pc.ontrack = (event) => {
      console.log("Remote stream received");
      console.log("STREAMS:", event.streams);
      console.log("VIDEO TRACKS:", event.streams[0]?.getVideoTracks());
      console.log("REMOTE TRACK STATE:", event.track.readyState, "muted:", event.track.muted);

      if (!remoteInboundStream.current) {
        remoteInboundStream.current = new MediaStream();
      }

      if (!remoteInboundStream.current.getTrackById(event.track.id)) {
        remoteInboundStream.current.addTrack(event.track);
      }

      assignRemoteStream(remoteInboundStream.current);

      event.track.onunmute = () => {
        if (remoteInboundStream.current) {
          assignRemoteStream(remoteInboundStream.current);
        }
      };
    };

    return pc;
  }, [assignRemoteStream]);

  // ─── Fetch sidebar users ──────────────────────────────────────────────────
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
      const res = await api.post('/api/messages', { conversationId, text })
      const newMessage = res.data;
      const formattedMessage = formatMessage(newMessage, loggedInUserId, selectedUser);
      setMessages((prev) => [...prev, formattedMessage])
      socket.emit("send-message", { conversationId, message: newMessage })
    } catch (err) {
      console.error("Failed to send messages! ", err);
    }
  }

  // ─── Socket: register user ────────────────────────────────────────────────
  useEffect(() => {
    if (!loggedInUserId) return;

    if (!socket.connected) socket.connect();

    const registerUser = () => {
      console.log("Registering user:", loggedInUserId);
      socket.emit("register-user", loggedInUserId);
    };

    if (socket.connected) registerUser();
    socket.on("connect", registerUser);

    return () => {
      socket.off("connect", registerUser);
    };
  }, [loggedInUserId]);

  // ─── Socket: join/leave room ──────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    socket.emit("join-room", conversationId);
    socket.emit("message-read", conversationId);
    return () => {
      socket.emit("leave-room", conversationId);
    }
  }, [conversationId]);

  // ─── Socket: messages ────────────────────────────────────────────────────
  useEffect(() => {
    const handleReceive = (msg: any) => {
      const formattedMessage = formatMessage(msg, loggedInUserId, selectedUser);
      setMessages((prev) => [...prev, formattedMessage]);
      socket.emit("message-delivered", { messageId: msg._id, conversationId: msg.conversationId });
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

    socket.on("receive-message", handleReceive);
    socket.on("message-delivered-update", handleDeliveredUpdate);
    socket.on("message-read-update", handleReadUpdate);

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("message-delivered-update", handleDeliveredUpdate);
      socket.off("message-read-update", handleReadUpdate);
    }
  }, [loggedInUserId, selectedUser, conversationId]);

  // ─── Socket: online users ────────────────────────────────────────────────
  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      console.log("ONLINE USERS:", users);
      setOnlineUsers(users);
    };
    socket.on("online-users", handleOnlineUsers);
    return () => { socket.off("online-users", handleOnlineUsers); };
  }, []);

  // ─── Socket: typing ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    return () => {
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, []);

  // ─── Socket: incoming call ───────────────────────────────────────────────
  useEffect(() => {
    const handleIncomingCall = ({ offer, caller }: any) => {
      console.log("Incoming call from:", caller);
      setIncomingCall({ offer, caller });
    };
    socket.on("incoming-call", handleIncomingCall);
    return () => { socket.off("incoming-call", handleIncomingCall); };
  }, []);

  // ─── Socket: call answered ───────────────────────────────────────────────
  useEffect(() => {
    const handleCallAnswered = async ({ answer }: any) => {
      console.log("Call answered");
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        await flushPendingIceCandidates();
      }
    };
    socket.on("call-answered", handleCallAnswered);
    return () => { socket.off("call-answered", handleCallAnswered); };
  }, [flushPendingIceCandidates]);

  // ─── Socket: ICE candidates ──────────────────────────────────────────────
  useEffect(() => {
    const handleIceCandidate = async ({ candidate }: any) => {
      console.log("ICE candidate received");
      if (!peerConnection.current || !candidate) return;

      if (peerConnection.current.remoteDescription) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn("Failed to add ICE candidate:", err);
        }
      } else {
        pendingIceCandidates.current.push(candidate);
      }
    };
    socket.on("ice-candidate", handleIceCandidate);
    return () => { socket.off("ice-candidate", handleIceCandidate); };
  }, []);

  // ─── Start Call (caller side) ─────────────────────────────────────────────
  const startCall = async () => {
    if (!selectedUser) return;
    try {
      // FIX 4: Get stream BEFORE setIsInCall so we can store it in ref first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStream.current = stream;
      console.log("LOCAL TRACKS BEFORE SEND:", stream.getTracks().map((t) => ({ kind: t.kind, readyState: t.readyState, muted: (t as MediaStreamTrack).muted })));

      // Now mount the modal — useEffect above will assign stream to video element
      setIsInCall(true);

      const pc = createPeerConnection(selectedUser._id);
      peerConnection.current = pc;

      attachLocalTracks(pc, stream);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", {
        to: selectedUser._id,
        offer,
        caller: { id: loggedInUserId, name: user?.fullName }
      });

      console.log("Outgoing call started");
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsInCall(false);
    }
  };

  // ─── Accept Call (callee side) ───────────────────────────────────────────
  // FIX 5: Capture incomingCall in a local variable to avoid stale closure
  const acceptCall = async () => {
    const callData = incomingCall; // capture before clearing state
    setIncomingCall(null);

    if (!callData) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStream.current = stream;
      console.log("LOCAL TRACKS BEFORE SEND:", stream.getTracks().map((t) => ({ kind: t.kind, readyState: t.readyState, muted: (t as MediaStreamTrack).muted })));
      setIsInCall(true);

      const pc = createPeerConnection(callData.caller.id);
      peerConnection.current = pc;

      attachLocalTracks(pc, stream);

      await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));
      await flushPendingIceCandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer-call", {
        to: callData.caller.id,
        answer
      });

      console.log("Call accepted");
    } catch (error) {
      console.error("Failed to accept call:", error);
      setIsInCall(false);
    }
  };

  // ─── End Call ────────────────────────────────────────────────────────────
  const endCall = () => {
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    remoteInboundStream.current = null;
    pendingRemoteStream.current = null;
    pendingIceCandidates.current = [];
    peerConnection.current?.close();
    peerConnection.current = null;
    setRemoteStream(null);

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setIsInCall(false);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`w-80 shrink-0 overflow-hidden ${isMobile ? (selectedUser ? 'hidden' : 'flex w-full') : 'hidden md:flex'}`}>
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={selectedUser} users={chatUsers} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedUser ? (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-lg text-muted-foreground">Select a user to chat</h1>
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

      {/* Video Call Modal */}
      {isInCall && (
        <VideoCallModal
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          remoteStream={remoteStream}
          onEndCall={endCall}
        />
      )}

      {/* Incoming Call Banner */}
      {incomingCall && (
        <div className="fixed top-10 left-10 bg-black text-white p-4 rounded-xl z-50 flex flex-col gap-2">
          <p className="font-semibold">📞 Incoming Call from {incomingCall.caller.name}</p>
          <div className="flex gap-2">
            <button
              onClick={acceptCall}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Accept
            </button>
            <button
              onClick={() => setIncomingCall(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </main>
  );
}