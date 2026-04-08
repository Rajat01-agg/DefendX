import { useEffect, useRef, useState, useCallback } from 'react'
import type { LogEvent } from '../data/mockData'
import { generateLogEvent } from '../data/mockData'

const MAX_LOGS = 200

export function useMockWebSocket() {
  const [logs, setLogs] = useState<LogEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [sources, setSources] = useState(142)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addLog = useCallback((log: LogEvent) => {
    setLogs(prev => {
      const next = [...prev, log]
      return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next
    })
  }, [])

  useEffect(() => {
    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setConnected(true)
      // Seed initial logs
      for (let i = 0; i < 18; i++) {
        const seed = generateLogEvent()
        setLogs(prev => [...prev, seed])
      }
    }, 600)

    // Start emitting events
    intervalRef.current = setInterval(() => {
      const log = generateLogEvent()
      addLog(log)
      if (Math.random() < 0.05) {
        setSources(s => Math.min(150, Math.max(130, s + (Math.random() > 0.5 ? 1 : -1))))
      }
    }, 900)

    return () => {
      clearTimeout(connectTimeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [addLog])

  return { logs, connected, sources }
}
