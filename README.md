# ShieldHer: AI-Assisted Digital Safety Toolkit for Women Facing Image-Based Abuse

**ShieldHer** is a privacy-first, trauma-informed digital safety Progressive Web Application (PWA) designed to empower survivors of image-based sexual abuse (IBSA) and non-consensual intimate image sharing (NCII). 

Built with an **On-Device First Privacy Model**, sensitive media assets and private incident notes are processed locally using client-side Web Crypto and IndexedDB to ensure zero unauthorized media uploads.

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |         SHIELDHER FRONTEND PWA        |
                                  |     (React + TypeScript + Vite)       |
                                  +-------------------+-------------------+
                                                      |
                   +----------------------------------+----------------------------------+
                   |                                  |                                  |
         +---------v---------+              +---------v---------+              +---------v---------+
         |    DEEPDETECT     |              |    SHIELDSCAN     |              |      SAFEDOC      |
         |  On-Device Media  |              |  Client-Side pHash|              |  Web Crypto SHA256|
         |    Screening      |              |   Hash Matching   |              |  PDF Evidence Log |
         +-------------------+              +-------------------+              +-------------------+
                   |                                  |                                  |
                   +----------------------------------+----------------------------------+
                                                      |
                                            +---------v---------+
                                            |  LOCAL INDEXEDDB  |
                                            | (AES-256 Storage) |
                                            +---------+---------+
                                                      |
                                            +---------v---------+
                                            | SAFEVOICE BACKEND |
                                            | (FastAPI + Claude)|
                                            +-------------------+
```

---

## 🌟 Prototype Status Classification

To maintain complete transparency for internship evaluation, capability statuses are classified below:

### ✅ IMPLEMENTED & VERIFIED PROTOTYPE FEATURES
- **PWA & Offline Shell**: Service worker precaching, offline installation manifest, mobile responsive UI.
- **DeepDetect Screening**: Local manipulation likelihood screening (`Low`, `Medium`, `Medium-High`, `High`), metadata anomaly extraction, and confidence scoring.
- **ShieldScan Hash Matching**: On-device pHash/dHash and SHA-256 perceptual hash matching against protected reference lists.
- **SafeDoc Evidence Packaging**: Client-side Web Crypto SHA-256 hash generation, structured incident reports, interactive complaint preparation checklists, and downloadable PDF evidence summaries.
- **SafeVoice Guidance Engine**: Trauma-informed multilingual intake guide (English, Tamil, Hindi) with risk classification (`NORMAL_SUPPORT`, `URGENT_SAFETY_CONCERN`, `IMMEDIATE_DANGER`).
- **Case Diary & Reminders**: Chronological event logs, user-controlled case status updates, and automated **Day 14 & Day 30 follow-up reminders** with zero-disclosure notification text (`"ShieldHer: You have a private reminder."`).
- **TrustCircle Directory**: Support network filtering by category (`counsellor`, `NGO`, `legal aid`, `campus support`, `cyber support`), language, and location with explicit demo labels (`"Demo / Not for real-world use"`), external navigation disclaimers, and sanitized case summary export.
- **Quick Exit**: Instant global exit key (ESC), title obfuscation (`Daily Weather & Life`), and neutral site fallback.
- **Responsible AI & Fairness Framework**: Disclosures for probabilistic limits, fairness tracking card matrix (`"Evaluation pending."`), and non-definitive AI confidence terminology rules.
- **Demo Mode Switcher**: 4 interactive demonstration scenarios for presentation testing.

### ⏳ PLANNED INTEGRATIONS (Pending External Approvals & Pilot Benchmarks)
- **StopNCII.org API Integration**: Direct API hashing submission pending formal institutional partner access.
- **Formal NGO & Legal Aid Partnerships**: Direct referral routing pending organizational pilot MOUs.
- **Validated Demographic Fairness Benchmark**: Evaluation datasets for demographic bias quantification.

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Run Vite local development server
npm run dev

# Run Vitest automated unit tests (50+ tests)
npm test

# Build production bundle & PWA service worker
npm run build
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI backend server
python main.py
```
Backend API will run at `http://127.0.0.1:8000`.

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `.env`:

```env
# Frontend API Endpoint
VITE_API_URL=http://127.0.0.1:8000

# Backend Claude API Key (Optional — Fallback Demo Mode active if empty)
CLAUDE_API_KEY=your_anthropic_claude_api_key_here

# Server Configuration
PORT=8000
HOST=127.0.0.1
```

---

## 🎯 Internship Presentation Demo Scenarios

ShieldHer includes a built-in **Demo Mode Switcher** located at the top bar. You can launch any of the 4 presentation scenarios with a single click:

1. **Scenario 1 (Manipulated Image)**: `Upload Image → DeepDetect Screening → SafeDoc Evidence Log`.
2. **Scenario 2 (Known Hash Match)**: `Upload Image → ShieldScan Alert → Takedown Guidance → SafeDoc`.
3. **Scenario 3 (Clean Match)**: `Upload Image → Clean Status → SafeDoc → SafeVoice Guidance`.
4. **Scenario 4 (Case Follow-Up)**: `Case Diary → Day 14 Reminder → TrustCircle Directory`.

---

## 🛡️ Responsible AI Disclosures & Confidence Policy

1. **Screening Disclaimer**: *"Screening result only. This is not proof of manipulation or abuse."*
2. **Terminology Policy**: Forbidden absolute claims (`"100% fake"`, `"Confirmed abuser"`). Enforced probabilistic terms (`"Screening indicates..."`, `"Possible indicators..."`).
3. **Fairness Matrix**: Fairness evaluation matrix across skin tone, age group, image quality, compression, and language is explicitly marked `"Evaluation pending."`.

---

## 🧪 Testing & Verification

- **Vitest Suite**: `npm test` (51 tests passing across 15 test files)
- **Python Backend Suite**: `python backend/test_backend.py` (4 tests passing)
- **Production PWA Build**: `npm run build`
