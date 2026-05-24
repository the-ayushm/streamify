import { io } from "socket.io-client"

const socketUrl = import.meta.env.VITE_SERVER_URL

if (!socketUrl) {
  throw new Error('VITE_SERVER_URL is required. Set it to your deployed backend URL.')
}

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false, 
})