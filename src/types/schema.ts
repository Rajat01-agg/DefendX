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
  job: { jobId: string; status: JobStatus }
  finding?: Finding
}

export interface Report {
  id: string
  jobId: string
  jsonReport: object               // full AgentOutput
  humanReport: string              // SOC markdown
  createdAt: string
  job: Job
}

export interface ReportListItem {
  id: string
  jobId: string
  createdAt: string
  job: {
    findingsCount: number
    actionsCount: number
    status: JobStatus
  }
}

export interface DomainStat {
  id: string
  jobId: string
  domain: Domain
  logsProcessed: number
  findingsCount: number
  actionsCount: number
  job: Job
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
  http: '#3965FF',
  infra: '#7551FF',
  auth: '#EE5D50',
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
  PENDING: '#A3AED0',
  FETCHING: '#3965FF',
  ANALYZING: '#FFB547',
  REMEDIATING: '#7551FF',
  COMPLETED: '#05CD99',
  ERROR: '#EE5D50',
}

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  block_ip: 'Block IP',
  rate_limit: 'Rate Limit',
  alert_soc: 'Alert SOC',
  manual_review: 'Manual Review',
}

export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  PENDING: '#A3AED0',
  IN_PROGRESS: '#FFB547',
  DONE: '#05CD99',
  FAILED: '#EE5D50',
}

export const SEV_COLORS: Record<Severity, { bg: string; color: string }> = {
  critical: { bg: 'rgba(227, 26, 26, 0.10)', color: '#E31A1A' },
  high: { bg: 'rgba(255, 181, 71, 0.12)', color: '#E09B30' },
  medium: { bg: 'rgba(117, 81, 255, 0.10)', color: '#7551FF' },
  low: { bg: 'rgba(57, 101, 255, 0.08)', color: '#3965FF' },
}

