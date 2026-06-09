import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

// create or reuse existing socket connection
export function connectSocket(token: string) {
  if (!token) return null

  // if socket already exists
  // , just update auth and reconnect if needed
  if (socket) {
    socket.auth = { token }
    if (!socket.connected) socket.connect()
    return socket
  }

  // initialize new socket connection
  socket = io(import.meta.env.VITE_SOCKET_URL || "http://13.203.215.191/", {
    autoConnect: true,
    auth: { token },
    transports: ["websocket"], // force websocket for real-time reliability
    withCredentials: true,
  })

  return socket
}

// force full reconnection (useful after login / token refresh)
export function reconnectSocket(token: string) {
  disconnectSocket()
  return connectSocket(token)
}

// get current socket instance
export function getSocket() {
  return socket
}

// disconnect and clear socket instance
export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

// safe event listener with auto re-attach on reconnect
export function listenSocket<T>(event: string, handler: (payload: T) => void) {
  const attach = () => {
    const s = getSocket()
    if (!s) return

    // avoid duplicate listeners
    s.off(event, handler)
    s.on(event, handler)
  }

  // attach immediately if socket exists
  attach()

  const s = getSocket()

  // reattach listeners after reconnect event
  s?.on("connect", attach)

  // cleanup function to remove listeners
  return () => {
    s?.off("connect", attach)
    getSocket()?.off(event, handler)
  }
}
