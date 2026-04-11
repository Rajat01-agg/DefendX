import { useEffect, useRef, useState } from 'react'

export interface WebSocketMessage {
  jobId: string
  state: string
  payload: Record<string, unknown>
  timestamp: number
}

export type SocketState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'

function getDefaultWsBase() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.hostname}:3000`
}

export function useWebSocket() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [socketState, setSocketState] = useState<SocketState>('connecting')
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attemptRef = useRef(0)

  const wsBase = import.meta.env.VITE_WS_BASE || getDefaultWsBase()

  const nextBackoffMs = () => {
    const cappedAttempt = Math.min(attemptRef.current, 4)
    return Math.min(15000, 1000 * Math.pow(2, cappedAttempt))
  }

  useEffect(() => {
    const connect = () => {
      setSocketState(attemptRef.current > 0 ? 'reconnecting' : 'connecting')
      const ws = new WebSocket(wsBase)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        setSocketState('connected')
        attemptRef.current = 0
        setReconnectAttempt(0)
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setMessages(prev => [...prev.slice(-299), message])
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        setConnected(false)
        setSocketState('disconnected')
        attemptRef.current += 1
        setReconnectAttempt(attemptRef.current)
        reconnectTimeoutRef.current = setTimeout(connect, nextBackoffMs())
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnected(false)
        setSocketState('disconnected')
      }
    }

    connect()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [wsBase])

  return { connected, messages, socketState, reconnectAttempt }
}
