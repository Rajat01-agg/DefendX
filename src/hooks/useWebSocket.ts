import { useEffect, useRef, useState } from 'react'

export interface WebSocketMessage {
  jobId: string
  state: string
  payload: Record<string, unknown>
  timestamp: number
}

export type SocketState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'completed'

function getDefaultWsBase() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.hostname}:3000`
}

export function useWebSocket() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [socketState, setSocketState] = useState<SocketState>('disconnected')
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const manuallyClosedRef = useRef(false)
  const completedRef = useRef(false)

  const wsBase = import.meta.env.VITE_WS_BASE || getDefaultWsBase()

  const connectSocket = () => {
    const existing = wsRef.current
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
      return
    }

    manuallyClosedRef.current = false
    completedRef.current = false
    setSocketState('connecting')

    const ws = new WebSocket(wsBase)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      setSocketState('connected')
      setReconnectAttempt(0)
    }

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data) as Record<string, unknown>
        if (raw.type === 'KEEP_ALIVE') return
        if (typeof raw.jobId !== 'string' || typeof raw.state !== 'string' || typeof raw.timestamp !== 'number') return

        const message: WebSocketMessage = {
          jobId: raw.jobId,
          state: raw.state,
          timestamp: raw.timestamp,
          payload: typeof raw.payload === 'object' && raw.payload !== null
            ? (raw.payload as Record<string, unknown>)
            : {},
        }

        if (raw.state === 'COMPLETED' || raw.state === 'FAILED' || raw.state === 'ERROR') {
          completedRef.current = true
        }

        setMessages(prev => [...prev.slice(-299), message])
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      setConnected(false)
      if (completedRef.current || manuallyClosedRef.current) {
        setSocketState('completed')
      } else {
        setSocketState('disconnected')
        setReconnectAttempt((prev) => prev + 1)
      }
      wsRef.current = null
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
      setSocketState('disconnected')
    }
  }

  const disconnectSocket = () => {
    manuallyClosedRef.current = true
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnected(false)
    setSocketState('disconnected')
  }

  useEffect(() => {
    return () => {
      manuallyClosedRef.current = true
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return { connected, messages, socketState, reconnectAttempt, connectSocket, disconnectSocket }
}
