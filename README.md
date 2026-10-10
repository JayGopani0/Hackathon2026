# Hackathon2026

Idea 1:
Product Requirements Document (PRD)

Project Name: AuditMyPitch
Target Sponsors: Gemini API, ElevenLabs, Capital One Nessie API, .Tech Domain
Target Completion: Hackathon MVP (Weekend Execution)

1. Executive Summary

AuditMyPitch is a lighthearted, hyper-focused web application where founders submit a startup pitch to be evaluated by an AI persona of their choice.

The system automatically generates a temporary Capital One Nessie virtual bank account for the user upon arrival. Using a structured scoring rubric across fixed business dimensions, the AI calculates an aggregate score from 0–100.

Score ≥ 80: The user passes and receives a mock seed grant deposited into their generated Nessie virtual account.
Score < 80: The user fails and receives a detailed rejection breakdown.

ElevenLabs voice synthesis reads the full feedback and verdict aloud in a voice matching the selected persona.

2. Core Features & System Architecture
2.1 Persona Selection

Users select from three predefined evaluator personas before submitting their pitch.

The Brutal VC
Sarcastic and hyper-critical.
Obsessed with unit economics and massive Total Addressable Market (TAM).
Challenges unrealistic assumptions and weak business models.
The Hype-Man / Web3 Degen
Overly energetic and enthusiastic.
Uses heavy industry buzzwords.
Focuses on hype, virality, and growth potential.
The Skeptical Quant
Cold, analytical, and data-driven.
Hyper-focused on financial projections and risk metrics.
Prioritizes measurable evidence over speculation.
2.2 Dynamic Nessie Account Generation
On landing or when the user clicks Start Session, the backend calls the Capital One Nessie API.
The backend automatically provisions a mock Customer and an associated Checking Account.
The account is initialized with a configurable starting balance, such as $0.00 or $500.00.
The generated Account ID and initial balance are displayed on the UI dashboard in real time.
2.3 Evaluation Rubric

The Gemini API evaluates each submission against four fixed categories, each worth 25 points.

Evaluation Category	Maximum Score
Financials & Unit Economics	25
Market Opportunity & TAM	25
Problem-Solution Fit & Innovation	25
Execution & Scalability	25
Total	100
Aggregate Score Calculation

The aggregate score is the sum of all four category scores.

Total Score = Financials + Market Opportunity + Problem-Solution Fit + Execution

Verdict and Grant Disbursement

PASS — Score ≥ 80

The backend marks the submission as passed.
A deposit request is sent to the Nessie API.
A mock seed grant, such as $10,000, is deposited into the user's generated checking account.
The UI displays the verdict, feedback, and updated account balance.

FAIL — Score < 80

The backend marks the submission as failed.
No seed grant is disbursed.
The UI displays the verdict and a category-by-category rejection breakdown.

The pass threshold is fixed at 80/100.

3. Data Flow & API Call Sequence
[User Frontend]
      |
      | 1. On Load / Start Session
      v
[Backend] ---> [Nessie API]
      |          Create Mock Customer
      |          Create Checking Account
      |
      v
[Frontend Dashboard]
      Display Account ID + Current Balance
      |
      | 2. User submits pitch + selects persona
      v
[Backend] ---> [Gemini API]
      |          Generate structured JSON:
      |          - Category scores
      |          - Aggregate score
      |          - Pass/fail verdict
      |          - Persona feedback
      |
      | 3. Evaluate aggregate score
      |
      +---- If Score >= 80 ----> [Nessie API]
      |                            POST deposit
      |                            Deposit mock seed grant
      |
      +---- If Score < 80 -----> Skip deposit
      |
      | 4. Generate spoken feedback
      v
[ElevenLabs API]
      Generate MP3 using selected persona voice
      |
      v
[Frontend Results UI]
      Display verdict, scores, feedback, and audio player
      |
      v
[Frontend Dashboard]
      Display updated Nessie account balance

API Integration Summary
Service	Purpose
Gemini API	Evaluate pitches and generate structured feedback
Capital One Nessie API	Create mock customers, checking accounts, and deposits
ElevenLabs API	Convert persona feedback into spoken audio
Frontend	Collect submissions and display account information and results
Backend	Orchestrate API calls, validate scores, and enforce grant eligibility
4. Gemini API JSON Schema Specification

Gemini should return structured JSON to ensure reliable score parsing and deterministic decision-making.

Example Response
{
  "category_scores": {
    "financials": 22,
    "market_opportunity": 20,
    "problem_solution_fit": 21,
    "execution_scalability": 18
  },
  "total_score": 81,
  "passed": true,
  "persona_feedback_text": "Look, your TAM is impressive, but your CAC projections are absurdly low. However, because your unit economics hold up on paper, I'm backing this."
}

Validation Rules
Each category score must be an integer between 0 and 25, inclusive.
total_score must equal the sum of all four category scores.
passed must be true if and only if total_score >= 80.
persona_feedback_text must contain the evaluation and verdict in the selected persona's style.
The backend must independently validate the scores and calculate the final total rather than trusting the model-generated total or verdict.
Invalid or incomplete JSON responses must not trigger a grant deposit.
5. Next Steps for Implementation
5.1 Nessie API Setup
Obtain an API key from the Capital One Nessie developer portal.
Verify the POST /customers endpoint.
Verify the POST /accounts endpoint.
Implement the account creation workflow.
Implement the deposit endpoint, such as POST /accounts/{id}/deposits, according to the API documentation.
Confirm that account balances update correctly after deposits.
5.2 Gemini System Prompts

Create a system prompt template for each of the three personas.

Each prompt must:

Enforce the four-category scoring rubric.
Define clear scoring criteria for each category.
Require structured JSON output.
Keep all category scores within the permitted range.
Encourage persona-specific feedback without changing the scoring criteria.
Avoid allowing the persona's tone to influence the objective scoring standards.
5.3 ElevenLabs Voice Selection
Select a distinct voice for each persona.
Assign an appropriate voice ID to each persona.
Use an energetic voice for the Hype-Man.
Use a deep, authoritative voice for the Brutal VC.
Use a measured, analytical voice for the Skeptical Quant.
Generate an MP3 containing the full evaluation and verdict.
Return the audio URL or audio data to the frontend.
5.4 Frontend Interface

Build a simple, responsive single-page interface using Tailwind CSS.

The UI should include:

Nessie Account Card: Displays the generated Account ID and current balance.
Persona Selector: Allows users to choose one of the three evaluator personas.
Pitch Submission Form: Provides a text area for entering the startup pitch.
Evaluation Results: Displays the aggregate score, individual category scores, and pass/fail verdict.
Feedback Panel: Displays the persona's written evaluation.
Audio Player: Plays the ElevenLabs-generated spoken feedback.
Updated Balance: Shows the account balance after a successful mock grant deposit.
6. Hackathon MVP Acceptance Criteria

The MVP is considered complete when all of the following criteria are met.

A user can start a session and receive a newly generated Nessie customer and checking account.
The UI displays the generated Account ID and current balance.
A user can select one of the three evaluator personas.
A user can submit a startup pitch for evaluation.
Gemini returns valid structured evaluation data.
The backend validates the category scores and calculates the aggregate score.
A score of 80 or higher triggers a single mock seed grant deposit.
A score below 80 does not trigger a deposit.
The results screen displays the score, verdict, and category breakdown.
ElevenLabs generates spoken feedback in the selected persona's voice.
The user can play the generated audio from the results screen.
The dashboard reflects the updated account balance after a successful deposit.
API keys remain on the backend and are never exposed in frontend code.
7. Security & Reliability Considerations
Store Gemini, ElevenLabs, and Nessie API credentials in backend environment variables.
Never expose API keys in browser code or client-side network requests.
Enforce the score threshold and grant eligibility on the backend.
Prevent duplicate grant deposits when users refresh, retry requests, or submit the same evaluation multiple times.
Handle API failures gracefully, including account creation errors, invalid model responses, failed deposits, and audio-generation errors.
Keep the grant amount configurable through backend configuration.
Treat seed grants as mock funds for the hackathon MVP, not real-world investment commitments.
Ensure the UI clearly communicates that scores and grant decisions are simulated.
8. Suggested MVP Execution Order
Set up the project: Create the frontend and backend scaffolding and configure environment variables.
Integrate Nessie: Implement customer and checking account creation.
Build the frontend: Create the account dashboard, persona selector, and pitch submission form.
Integrate Gemini: Implement structured evaluation and backend score validation.
Implement grant logic: Trigger a mock deposit only when the validated score reaches 80.
Integrate ElevenLabs: Generate and play spoken feedback.
Polish the experience: Add loading states, error handling, and clear pass/fail result screens.
Test the complete flow: Verify both passing and failing submissions, including retry and duplicate-deposit scenarios.
9. Final Product Vision

AuditMyPitch combines AI-powered startup evaluation, memorable evaluator personalities, voice-generated feedback, and simulated financial rewards into a fun, interactive hackathon experience.

The central user journey is simple:

Submit a pitch → Get roasted or hyped → Receive a score → Hear the verdict → Win a mock seed grant if the score is at least 80.

The goal is to deliver a polished, end-to-end MVP that demonstrates practical integrations with Gemini, ElevenLabs, and Capital One Nessie while keeping the experience entertaining, transparent, and reliable.

























Idea 2:
Product Requirement Document (PRD): AuraWealth
Autonomous AI Financial Concierge & Micro-Investments
---
1. Executive Summary & Value Proposition
AuraWealth is an omni-channel, voice-and-text financial management agent designed to transform personal finance for young adults and students. Rather than forcing users to log into fragmented banking apps and spreadsheets, AuraWealth delivers proactive financial guidance through iMessage and voice calls.
By unifying streaming analytics, large-scale financial data warehousing, LLM reasoning, and decentralized autonomous micro-investments, AuraWealth monitors bank activity, identifies surplus capital, generates natural audio summaries, and automatically deploys funds into high-yield liquidity pools or vaults on Solana.
---
2. Targeted Hackathon Sponsor Tracks
Sponsor Track	Integrated Technology	Functional Role in AuraWealth
Best iMessage Agent with Photon	Photon SDK / iMessage Kit	Primary conversational interface for chat notifications, approval requests, and interactive text workflows.
The Best Use of Nessie with Capital One	Capital One Nessie API	Mock banking backend supplying core checking/savings accounts, customer balances, and transaction history.
Best Use of Gemini API	Gemini 1.5 Pro / Flash	Central reasoning layer for multi-modal financial diagnostic, natural-language parsing, and dynamic advice generation.
Best Use of Snowflake	Snowflake Data Cloud	OLAP Data Warehouse for historical spending aggregations, predictive cash-flow modeling, and merchant categorization.
Best Use of ElevenLabs	ElevenLabs Conversational Voice / Audio Native	Text-to-Speech engine producing realistic voice notes and interactive audio phone calls summarizing daily/weekly financial health.
Best Use of Solana	Solana Web3.js / Anchor Smart Contracts	Low-cost, fast execution engine for automated micro-yield sweeps and liquid savings vaults.
Best Use of Tiger Data	Tiger Data (Timescale/Hypertable Engine)	Time-series ingestion engine streaming real-time transaction events and live crypto/fiat market prices.
DEV Writing Challenge	DEV.to Publishing Pipeline	Architectural post detailing full stack integration and agent execution loops.
---
3. High-Level Architecture & Data Flow
```
                                +-------------------+
                                | Capital One Nessie|
                                +---------+---------+
                                          | Real-time Webhooks / Poll
                                          v
+-------------------+           +-------------------+           +-------------------+
|   Photon API      |<--------->| Fast API Backend  |<--------->|    Tiger Data     |
| (iMessage Agent)  |           | (Python / Node)   |           | (Time-Series DB)  |
+-------------------+           +---------+---------+           +---------+---------+
          ^                               |                               |
          | Interactive                   v                               v
          v                     +-------------------+           +-------------------+
+-------------------+           |    Gemini API     |           |  Snowflake Cloud  |
|    ElevenLabs     |<--------->| (Agentic Logic)   |<--------->|  (Data Warehouse) |
|   (Audio/Voice)   |           +---------+---------+           +-------------------+
+-------------------+                     |
                                          v
                                +-------------------+
                                | Solana Blockchain |
                                | (Yield Vaults)    |
                                +-------------------+
```
Ingest & Store: Transaction events from Nessie are streamed into Tiger Data (for real-time time-series tracking) and synced to Snowflake (for deep historical querying).
Analyze & Reason: Gemini Pro queries Snowflake aggregations to compute safe-to-spend limits and potential investment surpluses.
Notify & Interact: Photon sends an iMessage to the user containing spending highlights and audio summaries powered by ElevenLabs.
Execute On-Chain: If the user texts "Yes" to a suggested savings sweep, the backend issues an automated transaction on Solana devnet.
---
4. Key Functional Features & User Experience
Feature A: Proactive Spending & Cash-Flow Alerts (iMessage + ElevenLabs)
User Flow: Every Friday evening, AuraWealth calculates the user’s weekly net savings.
Execution:
Snowflake executes a rolling aggregate query comparing the last 7 days against historical monthly averages.
Gemini translates the analytics into a concise, supportive narrative.
ElevenLabs renders a 15-second voice note sent via Photon iMessage: "Hey Ruben! You spent $42 less on dining out this week. You have an unallocated surplus of $30."
Feature B: Automated "Yield-Sweep" Micro-Investments (Solana)
User Flow: Immediately after sending the weekly summary, Photon prompts: "Would you like me to deposit $20 into your Solana SPL Yield Vault yielding 5.2% APY?"
Execution:
The user replies `"Sweep 20"` or tap-approves via inline message.
The Fast API backend signs a transfer instruction on Solana devnet to mint/transfer yield-bearing synthetic tokens (or USDC-SPL) into the user's non-custodial wallet address.
Nessie API registers a corresponding pending debit to reflect the swept funds.
Feature C: Interactive Voice Financial Concierge (ElevenLabs + Gemini)
User Flow: User initiates an audio call or requests a voice briefing: "Aura, can I afford to buy a $150 jacket right now?"
Execution:
Gemini retrieves live balance endpoints from Nessie and time-series spending velocity from Tiger Data.
Gemini factors in upcoming recurring bills stored in Snowflake.
ElevenLabs speaks the real-time response: "You have $220 left in discretionary budget, but your subscription bills hit on Tuesday. You can afford it, but it will leave you with a narrow $30 buffer."
---
5. System Specifications & Technical Integration
1. Data Layer: Snowflake & Tiger Data
Tiger Data (Timescale Hypertables): Stores real-time stream ticks of transaction logs (`timestamp`, `amount`, `merchant`, `category`) and crypto pricing ticks for sub-second query performance.
Snowflake: Holds cold analytical data models:
`FACT_TRANSACTIONS`: Transformed raw banking events.
`DIM_USER_BUDGET`: Dynamic spending baseline thresholds.
Snowflake Cortex / External Functions: Allows triggering Gemini REST API directly inside SQL routines for bulk sentiment categorization on merchant data.
2. Conversational & Voice Layer: Photon & ElevenLabs
Photon iMessage Agent: Listens to incoming webhooks from Apple Messages/SMS. Routes user intents (e.g., `/balance`, `/sweep`, `/budget`) to the central router.
ElevenLabs: Utilizes the `elevenlabs-node` SDK or Python client. Uses the "Adam" or "Rachel" voice model with customized latency-optimized settings (`eleven_turbo_v2_5`) for real-time audio playback.
3. Banking & On-Chain Layer: Nessie & Solana
Capital One Nessie API:
Endpoint: `GET /accounts/{id}/bills` and `GET /accounts/{id}/purchases`
Endpoint: `POST /accounts/{id}/transfers` (reflecting yield sweeps)
Solana Web3 Engine:
Uses `@solana/web3.js` connected to Solana Devnet.
Interacts with an Anchor program representing a tokenized lock-box/savings contract, logging transaction signatures back to Tiger Data.
---
6. Implementation Plan & Hackathon Timeline
Phase	Timeframe	Milestones & Tasks
Phase 1: Setup & Ingestion	Hours 0 – 6	• Provision Tiger Data Hypertable and Snowflake trial schemas.<br>• Seed Capital One Nessie API mock customer accounts and transaction datasets.<br>• Setup Photon iMessage Webhook environment.
Phase 2: Core Logic & AI	Hours 6 – 14	• Integrate Gemini 1.5 API with custom tools/function calls for finance.<br>• Build Snowflake SQL view for weekly surplus calculation.<br>• Set up ElevenLabs SDK pipeline to convert Gemini text responses to MP3 audio.
Phase 3: Solana & Agent Loop	Hours 14 – 20	• Deploy a basic Solana Anchor program (or web3 transfer script on Devnet).<br>• Connect Photon iMessage listener to trigger Solana transactions upon user confirmation.<br>• Wire Tiger Data real-time metrics into the system status dashboard.
Phase 4: Polish & Pitch	Hours 20 – 24	• Record end-to-end demo video showing iMessage text $\rightarrow$ ElevenLabs Audio $\rightarrow$ Solana Tx.<br>• Draft DEV.to technical post covering multi-sponsor integration.
---
7. Success Criteria & Judging Alignment
Seamless Stack Synergy: Demonstrates an undeniable dependency chain: Nessie supplies banking raw data $\rightarrow$ Tiger Data ingests real-time ticks $\rightarrow$ Snowflake calculates metrics $\rightarrow$ Gemini reasons $\rightarrow$ ElevenLabs voices insights $\rightarrow$ Photon handles iMessage $\rightarrow$ Solana executes yield sweeps.
User Experience: Zero reliance on a complex web frontend; interaction is immediate, familiar, and conversational through iMessage and natural voice.
Execution & Reliability: Fast response times (<2s for text responses, <4s for voice generation) using streaming webhooks and light-weight Devnet transactions.
