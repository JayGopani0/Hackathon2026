# AuditMyPitch — Hackathon Development Roadmap

**Project Overview:** A lightweight web application where founders submit pitches to AI investor personas, receive multi-category scores and voice feedback, and automatically receive mock seed deposits into a generated Capital One Nessie bank account if their pitch scores 80/100 or higher.

**Tech Stack:** 
* **Backend:** Python (Flask or FastAPI)
* **Frontend:** Single-page HTML/JavaScript (with Tailwind CSS via CDN)
* **Integrations:** Capital One Nessie API, Gemini API, ElevenLabs API

---

## Phase 1: API Setup & Environment Configuration (Hours 1–2)

- [ ] **1.1 Gather API Keys & Credentials**
  - Obtain **Gemini API** key from Google AI Studio.
  - Obtain **ElevenLabs API** key and select 3 distinct Voice IDs (Brutal VC, Hype-Man, Skeptical Quant).
  - Obtain **Capital One Nessie API** key from the developer portal.
  - Register/claim your custom domain on **.Tech Domains**.

- [ ] **1.2 Project Scaffolding**
  - Create project repository structure:
    ```text
    audit-my-pitch/
    ├── app.py                 # Main Python backend script
    ├── requirements.txt       # Dependencies (flask, requests, python-dotenv)
    ├── .env                   # Secret API keys
    └── templates/
        └── index.html         # Frontend interface
    ```
  - Create a virtual environment and install dependencies: `pip install flask requests python-dotenv`.

---

## Phase 2: Python Backend Core Services (Hours 3–6)

- [ ] **2.1 Capital One Nessie Integration Service**
  - Implement function `create_nessie_account()` to provision a new customer/account on load.
  - Implement function `deposit_grant(account_id, amount)` to perform a `POST` request depositing funds when a score reaches $\ge 80$.
  - Implement function `get_account_balance(account_id)` to query live updates.

- [ ] **2.2 Gemini API Structured Parser**
  - Construct system prompts for the **3 Personas**:
    - *The Brutal VC*: Sarcastic, critical of CAC/LTV and profitability.
    - *The Hype-Man*: Web3/Degen slang, hyper-energetic, viral-focused.
    - *The Skeptical Quant*: Cold, metrics-driven, analytical.
  - Set up Gemini JSON enforcement mode to guarantee output matching:
    ```json
    {
      "category_scores": {
        "financials": 0,
        "market_opportunity": 0,
        "problem_solution_fit": 0,
        "execution_scalability": 0
      },
      "total_score": 0,
      "passed": false,
      "critique": "Full critique text..."
    }
    ```

- [ ] **2.3 ElevenLabs Audio Synthesis**
  - Implement `generate_voice_critique(text, persona)` to map the persona to its assigned ElevenLabs `voice_id`.
  - Stream or return the generated audio binary/file path to the frontend.

- [ ] **2.4 Unified Pipeline API Route (`POST /api/audit`)**
  - Accept pitch text, selected persona, and user Nessie `account_id`.
  - Send pitch to Gemini $\rightarrow$ Parse category scores and aggregate total score.
  - Calculate pass status (`total_score >= 80`).
  - If `passed == true`, execute `deposit_grant()`.
  - Send `critique` text to ElevenLabs $\rightarrow$ Retrieve audio payload.
  - Return consolidated JSON response (scores, updated balance, grant status, and audio file URL).

---

## Phase 3: Single-Page UI & Frontend Scripting (Hours 7–10)

- [ ] **3.1 Visual Dashboard Layout (`index.html`)**
  - Add Tailwind CSS via CDN.
  - Build **Bank Account Header**: Display auto-generated Nessie Account ID and live balance badge.
  - Build **Input Section**: Persona selection dropdown, startup pitch text area, and "Audit My Pitch" CTA button.
  - Build **Scorecard Display**: Grid layout displaying the 4 category scores (0–25) and total score badge (0–100).
  - Build **Audio & Grant Result Player**: HTML `<audio>` player for ElevenLabs response and a visual banner ("GRANT APPROVED - $10,000 DEPOSITED" vs. "FUNDING REJECTED").

- [ ] **3.2 Client-Side JavaScript Logic**
  - On page load (`DOMContentLoaded`), trigger account generation and render initial account details.
  - Handle form submit: toggle loading state/spinners during API processing.
  - Update UI dynamically with category scores, play critique audio automatically, and update bank balance upon grant approval.

---

## Phase 4: Testing, Polishing & Demo Prep (Hours 11–12)

- [ ] **4.1 End-to-End Testing & Edge Cases**
  - Test short, poor pitches to ensure they fail ($<80$) and do *not* trigger deposits.
  - Test comprehensive, detailed pitches to verify successful grant triggers ($\ge 80$).
  - Verify prompt reliability and error fallback if JSON parsing fails.

- [ ] **4.2 Deployment & Domain Setup**
  - Deploy application to Render, Railway, or Vercel/Replit.
  - Point your `.tech` domain DNS records to your deployed instance (e.g., `auditmypitch.tech`).

- [ ] **4.3 Hackathon Submission Deliverables**
  - Record a short 2-minute video demo showing pitch submission, critique audio playback, and live bank balance deposit.
  - Write a clear README in your GitHub repository detailing API setup and architecture.
  - Submit the project to the target sponsor prize categories on the hackathon platform.
```

eof

You can now use this roadmap to track your progress step-by-step during the hackathon. Let me know if you would like to write the initial Python backend script (`app.py`) or the HTML frontend file next!