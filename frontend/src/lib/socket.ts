import { io } from "socket.io-client"

const socketUrl = import.meta.env.VITE_SERVER_URL ?? `http://${window.location.hostname}:5000`

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false, 
})