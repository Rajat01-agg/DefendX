<div align="center">

# 🛡️ DefendX — Autonomous SOC Defense Platform

### *Alert to Action in Seconds.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**DefendX** is a real-time, autonomous Security Operations Center (SOC) dashboard that detects, triages, and remediates threats — all without human delay. Traditional SOCs take hours. DefendX takes **< 3 seconds**.

[🌐 Live Deployment](https://defend-x.vercel.app/) · [🚀 Live Demo](https://youtu.be/QlcglM-VI2E) · [📂 Backend Repo](https://github.com/rajaXcodes/gaurdianOps)

</div>

---

## 📸 Overview

DefendX provides a premium, dark-themed command center interface for security teams. It visualizes the entire autonomous pipeline — from raw log ingestion to AI-powered threat classification to automated remediation — in real time.

### Key Highlights

| Metric              | Value               |
| ------------------- | ------------------- |
| Response Time       | **< 3 seconds**     |
| Threat Coverage     | **100%**            |
| Auto-Triage Rate    | **90%+**            |
| Avg Breach Cost Saved | **$4.9M**         |

---

## ✨ Features

### 🏠 Landing Page
- Cinematic hero section with animated gradient orbs and scan-line effects
- Feature showcase, threat domain cards, and comparison table (Traditional SOC vs DefendX)
- Use-case breakdowns for SOC Analysts, CISOs, and DevOps/SRE teams

### 📊 Dashboard
- **Global Metrics** — Total logs processed, findings detected, actions taken, and job count
- **Attack Volume Chart** — Real-time visualization of attack trends using Recharts
- **Findings Feed** — Live incident stream with severity badges and classification details
- **Automated Actions** — Status of autonomous remediation actions (block IP, rate limit, alert SOC)
- **Domain Breakdown** — Per-domain (HTTP, Auth, Infra) log/finding/action distribution
- **Recent Jobs** — Pipeline execution history with status indicators
- **Portal Status Table** — Infrastructure node health monitoring

### ⚡ Live Activity
A 3-column real-time operations view:
- **Telemetry Stream** — Simulated log ingestion via WebSocket with source indicators
- **Commander Agent** — AI threat classification engine with JSON schema output
- **Remediation Engine** — Automated action execution tracker with status progression

### 📋 Reports
- Filterable findings table (by domain, severity, search query)
- Paginated results with confidence bars and action status indicators
- Domain coverage analytics and job pipeline status
- Export functionality

### 🔐 Authentication
- Protected routes with Zustand-based auth state management
- Styled login page with glassmorphism effects

### ⚙️ Settings & Profile
- User profile management
- Platform configuration interface

---

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `frontend` root based on your backend URL (usually port 3000):
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
│   ├── LoginPage.tsx
│   ├── ProfilePage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── store/
│   └── authStore.ts      # Zustand auth state
├── types/
│   └── schema.ts         # TypeScript types (mirrors Prisma models)
├── App.tsx               # Router + protected routes
├── main.tsx              # Entry point
├── App.css               # App-level styles
└── index.css             # Global styles & design tokens
```

---

## 🧰 Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| **Framework**    | React 19 + TypeScript 6                                    |
| **Build Tool**   | Vite 8                                                      |
| **Styling**      | Tailwind CSS 4.2 + Custom CSS (glassmorphism, animations)  |
| **State**        | Zustand 5                                                   |
| **Routing**      | React Router DOM 7                                          |
| **Charts**       | Recharts 3                                                  |
| **Animations**   | Framer Motion 12                                            |
| **Icons**        | Lucide React                                                |
| **Fonts**        | Space Grotesk + JetBrains Mono (Google Fonts)              |
| **WebSocket**    | `ws` (mock implementation for demo)                        |

---

## 📐 Data Schema

The frontend is built to mirror a **Prisma-backed** backend schema:

| Model         | Description                                              |
| ------------- | -------------------------------------------------------- |
| `Job`         | Pipeline execution — from log fetch to remediation       |
| `Finding`     | Detected threat with severity, confidence, and offender  |
| `Action`      | Remediation step (block_ip, rate_limit, alert_soc, etc.) |
| `Report`      | JSON + human-readable markdown SOC report                |
| `DomainStat`  | Per-domain aggregated metrics                            |
| `GlobalStat`  | System-wide totals                                       |

### Threat Domains

| Domain   | Label              | Coverage Areas                                        |
| -------- | ------------------ | ----------------------------------------------------- |
| `http`   | HTTP / Network     | SQL injection, DDoS, port scanning                    |
| `auth`   | Identity & Auth    | Brute force, credential stuffing, session hijacking   |
| `infra`  | Infrastructure     | Service crash, resource exhaustion, config drift       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Rajat01-agg/DefendX.git
cd DefendX

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🔑 Authentication

The app uses **mock authentication** for demo purposes — any email/password combination will grant access. In production, this would connect to your identity provider.

**Default mock user:**
| Field     | Value                |
| --------- | -------------------- |
| Name      | Rajat Aggarwal       |
| Email     | rajat@defendx.io     |
| Role      | CISO                 |
| Clearance | LEVEL 4 CLEARANCE    |

---

## 🗺️ Routes

| Path          | Page             | Protected |
| ------------- | ---------------- | --------- |
| `/`           | Landing Page     | ❌         |
| `/login`      | Login            | ❌         |
| `/dashboard`  | SOC Dashboard    | ✅         |
| `/live`       | Live Activity    | ✅         |
| `/reports`    | Reports & Intel  | ✅         |
| `/profile`    | User Profile     | ✅         |
| `/settings`   | Settings         | ✅         |

---

## 🎨 Design System

DefendX uses a curated cybersecurity-themed design language:

- **Background**: `#070A12` (deep navy-black)
- **Cards**: Glass-morphism with `backdrop-filter: blur(20px)` and subtle borders
- **Accent Palette**:
  - Cyan `#00D4FF` — primary actions, network domain
  - Green `#00FF88` — success states, completed actions
  - Purple `#8B5CF6` — infrastructure domain, analysis
  - Red `#FF2D55` — critical severity, auth domain
  - Amber `#FFB800` — warning, in-progress states
- **Typography**: Space Grotesk (UI) + JetBrains Mono (data/code)
- **Effects**: Scan-line overlay, pulsing status indicators, gradient orbs

---

## 🔗 Related

- **Live Deployment**: [defend-x.vercel.app](https://defend-x.vercel.app/)
- **Backend (GuardianOps)**: [github.com/rajaXcodes/gaurdianOps](https://github.com/rajaXcodes/gaurdianOps)
- **Demo Video**: [youtu.be/QlcglM-VI2E](https://youtu.be/QlcglM-VI2E)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with 🛡️ by [Rajat Aggarwal](https://github.com/rajaXcodes)**

*DefendX — Because every second counts in cybersecurity.*

</div>
