# PIDE Protocol

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/built%20with-TypeScript-blue)
![Solidity](https://img.shields.io/badge/contracts-Foundry-orange)
![zkTLS](https://img.shields.io/badge/proofs-zkTLS-green)
![Score](https://img.shields.io/badge/Lighthouse-100%2F100-success)

> **The Bridge Between Digital Truth and On-Chain Reality.**
> Monetize your reputation, not your privacy. The first zkTLS-powered Data Exchange for Web3 Gaming & Ethical Finance.

![Dashboard Preview](public/nebula-starfield.jpg)
*(Replace with your actual dashboard screenshot in the repo)*

## 🌑 The Void Luxury Architecture

PIDE is not just a dashboard; it is a full-stack data integrity protocol. It allows users to generate Zero-Knowledge proofs of web2 data (Steam, Bank Accounts, GitHub) and bridge them on-chain without revealing sensitive info.

**Live Demo:** https://pide.codenut.xyz/

### ⚡ Core Features
* **zkTLS Handshake:** Securely intercept TLS sessions client-side to verify data provenance.
* **Zero-Knowledge Privacy:** Data is verified locally; only the proof is submitted on-chain.
* **Void Luxury UI:** A stark, monochrome interface designed for high-density information.
* **Institutional Grade:** Fully audited codebase with 100/100 Lighthouse performance scores.

---

## 🏗️ Technical Stack

### **Frontend (The Watchtower)**
* **Framework:** React 18 + Vite (Strict Mode)
* **Styling:** TailwindCSS + Framer Motion (Fluid Light Design System)
* **Performance:** Code Splitting, Tree Shaking, WebP/AVIF Assets
* **Accessibility:** ARIA-compliant, Screen Reader Optimized (Score: 97)

### **Smart Contracts (The Vault)**
* **Framework:** Foundry (Forge)
* **Language:** Solidity 0.8.20
* **Security:** Reentrancy Guards, Access Control, Pausable State

### **Infrastructure**
* **Proof Generation:** Reclaim Protocol (zkTLS)
* **Storage:** IPFS / Supabase
* **Testing:** Cypress (E2E), Vitest (Unit), Foundry (Fuzzing)

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* pnpm
* Foundry

### 1. Clone & Install
```bash
git clone https://github.com/sinanzx/pide
cd pide-protocol

# Install dependencies
pnpm install

2. Configure Environment
Copy the example environment file and fill in your keys (Reclaim App ID, WalletConnect Project ID).

Bash

cp .env.example .env
3. Run Development Server
Bash

pnpm dev
Open http://localhost:5173 to view the terminal.

📂 Documentation Deep Dive
We believe in radical transparency. Explore our engineering standards:
Document	                                  Description
Architecture Overview	               High-level system design and data flow.
Security Checklist	                 Audit reports and safety measures.
Performance Report	                 How we achieved <100KB initial bundle size.
Accessibility Audit	                 Compliance with WCAG 2.1 standards.

🧪 Testing
Frontend Tests:

Bash

pnpm test        # Unit tests
pnpm cypress:run # End-to-End tests
Contract Tests:

Bash

forge test -vvv
🛡️ Security
This project has undergone rigorous internal auditing.

Static Analysis: Slither & Mythril

Fuzz Testing: Foundry Invariant Tests

Found a vulnerability? Please reach out via GitHub Issues.

<p align="center"> Built with ⚫️ <strong>Void Design</strong> during the Hackathon. </p>
