// ── Enums (mirror Prisma exactly) ────────────────────────────────────────

export type JobStatus = 'PENDING' | 'FETCHING' | 'ANALYZING' | 'REMEDIATING' | 'COMPLETED' | 'ERROR'
export type ActionStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED'
export type Domain = 'http' | 'infra' | 'auth'
export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type ActionType = 'block_ip' | 'rate_limit' | 'alert_soc' | 'manual_review'

// ── Models ───────────────────────────────────────────────────────────────

export interface Job {
  id: string
  jobId: string
  status: JobStatus
  windowFrom: number   // epoch ms
  windowTo: number     // epoch ms
  totalLogs: number
  findingsCount: number
  actionsCount: number
  createdAt: string    // ISO date
  completedAt?: string
  findings: Finding[]
  actions: Action[]
  report?: Report
  domainStats: DomainStat[]
}

export interface Finding {
  id: string
  jobId: string
  findingId: string                // INC-001, INC-002 …
  domain: Domain
  classification: string           // brute_force, resource_exhaustion, port_scan, sql_injection, …
  severity: Severity
  confidence: number               // 0–1
  context: {
    service: string
    app: string
    environment: string
  }
  offender: {
    type: 'ip' | 'user' | 'service'
    value: string
  }
  metrics: {
    event_count: number
    unique_targets: number
    success_count: number
    failure_count: number
  }
  timeWindowFrom: number
  timeWindowTo: number
  evidenceSamples: string[]
  summary: string
  createdAt: string
  actions: Action[]
}

export interface Action {
  id: string
  jobId: string
  findingId?: string
  domain: Domain
  actionType: ActionType
  description: string
  status: ActionStatus
  completedAt?: string
  createdAt: string
}

export interface Report {
  id: string
  jobId: string
  jsonReport: object               // full AgentOutput
  humanReport: string              // SOC markdown
  createdAt: string
}

export interface DomainStat {
  id: string
  jobId: string
  domain: Domain
  logsProcessed: number
  findingsCount: number
  actionsCount: number
}

export interface GlobalStat {
  id: string                       // always "singleton"
  totalJobs: number
  totalLogs: number
  totalFindings: number
  totalActions: number
  lastUpdated: string
}

// ── Helper labels ────────────────────────────────────────────────────────

export const DOMAIN_LABELS: Record<Domain, string> = {
  http: 'HTTP / Network',
  infra: 'Infrastructure',
  auth: 'Identity & Auth',
}

export const DOMAIN_COLORS: Record<Domain, string> = {
  http: '#00D4FF',
  infra: '#8B5CF6',
  auth: '#FF2D55',
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  PENDING: 'Pending',
  FETCHING: 'Fetching Logs',
  ANALYZING: 'Analyzing',
  REMEDIATING: 'Remediating',
  COMPLETED: 'Completed',
  ERROR: 'Error',
}

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  PENDING: '#6B7280',
  FETCHING: '#00D4FF',
  ANALYZING: '#FFB800',
  REMEDIATING: '#8B5CF6',
  COMPLETED: '#00FF88',
  ERROR: '#FF2D55',
}

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  block_ip: 'Block IP',
  rate_limit: 'Rate Limit',
  alert_soc: 'Alert SOC',
  manual_review: 'Manual Review',
}

export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  PENDING: '#6B7280',
  IN_PROGRESS: '#FFB800',
  DONE: '#00FF88',
  FAILED: '#FF2D55',
}

export const SEV_COLORS: Record<Severity, { bg: string; color: string }> = {
  critical: { bg: 'rgba(255,45,85,0.15)', color: '#FF2D55' },
  high: { bg: 'rgba(255,184,0,0.15)', color: '#FFB800' },
  medium: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  low: { bg: 'rgba(0,212,255,0.15)', color: '#00D4FF' },
}
