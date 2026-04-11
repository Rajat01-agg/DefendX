import { useEffect, useState, useRef } from 'react'
import { Target, AlertCircle } from 'lucide-react'

export interface Finding {
  finding_id?: string;
  findingId?: string;
  severity?: string;
  domain?: string;
  classification?: string;
  summary?: string;
  recommended_action?: string;
  [key: string]: any;
}

export interface MappedFeedItem {
  findingId: string;
  message: string;
  color: string;
  domain: string;
  classification: string;
}

interface CommanderAgentProps {
  findings?: Finding[]
  revealDelayMs?: number
}

export default function CommanderAgent({ findings = [], revealDelayMs = 1400 }: CommanderAgentProps) {
  const [radarAngle, setRadarAngle] = useState(0)
  const [feed, setFeed] = useState<MappedFeedItem[]>([])
  const [queue, setQueue] = useState<MappedFeedItem[]>([])
  const processedCount = useRef(0)

  useEffect(() => {
    const radarInterval = setInterval(() => {
      setRadarAngle(a => (a + 2) % 360)
    }, 30)
    return () => clearInterval(radarInterval)
  }, [])

  // 1. Process new findings and add to queue
  useEffect(() => {
    if (!findings || !Array.isArray(findings) || findings.length === 0) {
      setFeed([])
      setQueue([])
      processedCount.current = 0
      return
    }

    // Handle full array resent or cleanup logic where length shrinks
    if (findings.length < processedCount.current) {
      setFeed([])
      setQueue([])
      processedCount.current = 0
    }

    const newFindings = findings.slice(processedCount.current)
    if (newFindings.length === 0) return

    const newMappedItems = newFindings.reduce((acc: MappedFeedItem[], f: Finding | null | undefined) => {
      if (!f) return acc; // Filter out bad/falsy objects safely 

      const sev = String(f.severity || '').toLowerCase()
      acc.push({
        domain: String(f.domain || 'unknown'),
        classification: String(f.classification || 'unknown'),
        findingId: String(f.finding_id || f.findingId || 'INC-000'),
        message: `${f.summary || ''} Escalating → ${f.recommended_action || ''}`,
        color: sev === 'critical' ? '#EE5D50' :
               sev === 'high' ? '#E09B30' :
               sev === 'medium' ? '#FFB547' : '#3965FF'
      });

      return acc;
    }, []);

    // IMPORTANT: Update processedCount by the length of the origin raw array
    // so it doesn't drift if there were null/filtered findings.
    processedCount.current += newFindings.length

    if (newMappedItems.length > 0) {
      setQueue(prevQueue => [...prevQueue, ...newMappedItems]);
    }
  }, [findings])

  // 2. Consume the queue asynchronously and securely
  useEffect(() => {
    if (queue.length === 0) return;

    const timeoutId = setTimeout(() => {
      setQueue(prevQueue => {
        if (prevQueue.length === 0) return prevQueue;
        
        const [nextItem, ...rest] = prevQueue;
        
        // Final guard against dropping falsy/undefined inside the feed
        if (nextItem) {
          setFeed(prevFeed => [nextItem, ...prevFeed]);
        }
        
        return rest;
      });
    }, revealDelayMs);

    return () => clearTimeout(timeoutId);
  }, [queue, revealDelayMs]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#080B14',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px 16px',
      gap: '16px',
      overflow: 'hidden',
    }}>
      {/* Radar Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        {/* Radar orb */}
        <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
          {[60, 45, 30].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size,
              borderRadius: '50%',
              border: `1px solid rgba(238, 93, 80, ${0.15 - i * 0.04})`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(238,93,80,0.4)" />
                <stop offset="100%" stopColor="rgba(238,93,80,0)" />
              </radialGradient>
            </defs>
            <path
              d={`M 30 30 L ${30 + 26 * Math.cos((radarAngle - 90) * Math.PI / 180)} ${30 + 26 * Math.sin((radarAngle - 90) * Math.PI / 180)} A 26 26 0 0 0 ${30 + 26 * Math.cos((radarAngle - 150) * Math.PI / 180)} ${30 + 26 * Math.sin((radarAngle - 150) * Math.PI / 180)} Z`}
              fill="url(#sweep)"
            />
            <line
              x1="30" y1="30"
              x2={30 + 26 * Math.cos((radarAngle - 90) * Math.PI / 180)}
              y2={30 + 26 * Math.sin((radarAngle - 90) * Math.PI / 180)}
              stroke="rgba(238,93,80,0.6)"
              strokeWidth="1.5"
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12, height: 12, borderRadius: '50%',
            background: 'radial-gradient(circle, #EE5D50, #880022)',
            border: '1px solid #EE5D5088',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Target size={6} color="var(--bg-surface)" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#A0AEC0', letterSpacing: '1px' }}>COMMANDER AGENT</div>
          <div style={{ fontSize: '10px', color: '#63B3ED', letterSpacing: '1.5px', marginTop: '2px' }}>AUTONOMOUS TRIAGE LIVE STREAM</div>
        </div>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      {/* Feed of Cards */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {feed.map((item, idx) => (
          <div
            key={idx}
            className="fade-in-up"
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${item.color}33`,
              borderRadius: '12px',
              padding: '14px',
              boxShadow: `0 4px 12px ${item.color}11`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={14} color={item.color} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: item.color }}>{item.findingId}</span>
              <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--text-muted)' }}>JUST NOW</span>
            </div>
            
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.4 }}>
              {item.message}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{
                padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                background: `${item.color}18`, color: item.color, letterSpacing: '0.5px',
              }}>
                {item.domain.toUpperCase()}
              </span>
              <span style={{
                padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
                background: 'var(--border)', color: 'var(--text-muted)',
              }}>
                {item.classification.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
