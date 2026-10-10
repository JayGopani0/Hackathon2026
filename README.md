# Hackathon2026

Tech Stack & Architecture
Backend: Python (Flask or FastAPI), using requests to hit the Gemini, ElevenLabs, and Capital One Nessie APIs.

Frontend: A single index.html file with vanilla JavaScript (or Tailwind CDN styling) containing:

A bank account generation card showing the live Nessie balance.

A dropdown for the 3 personas (The Brutal VC, The Hype-Man, The Skeptical Quant).

A text area for the pitch.

A breakdown table for the 4 category scores, total score, and audio player for the full critique.

📋 Step-by-Step Implementation Guide
Step 1: Capital One Nessie API (Mock Bank Account)
Endpoint to call: POST /enterprise/accounts or standard customer/account creation endpoints depending on your Nessie sandbox setup.

What it does: When the user loads the page or clicks a "Create Test Account" button, your Python backend sends a request to Nessie to spin up a mock account.

Response handling: Save the _id of the account in your frontend session/state so you can deposit money into it later.

Step 2: Gemini API (Structured Evaluation)
Prompt Engineering: Send the pitch text along with a strict system instruction telling Gemini to return valid JSON only matching this exact format:

JSON
{
  "category_scores": {
    "financials": 22,
    "market_opportunity": 20,
    "problem_solution_fit": 21,
    "execution_scalability": 18
  },
  "total_score": 81,
  "passed": true,
  "critique": "Your full paragraph critique written in the requested persona's voice..."
}
Why JSON mode? It prevents your Python script from breaking when parsing the score and categories to check if it hits the 80/100 threshold.

Step 3: ElevenLabs API (Full Audio Critique)
Voice mapping: Map your 3 personas to 3 distinct ElevenLabs Voice IDs (e.g., a sharp authoritative voice for the VC, an upbeat voice for the Hype-Man, a neutral analytical voice for the Quant).

Endpoint: Send the critique string from Gemini to the ElevenLabs text-to-speech endpoint (POST /v1/text-to-speech/{voice_id}).

Handling: Return the resulting audio stream or URL back to your frontend HTML <audio> element so the user can hit play and hear the full roast.

Step 4: Conditional Nessie Deposit
In your Python backend, check the total_score returned by Gemini:

If total_score >= 80, execute a POST request to the Nessie API to deposit a mock seed grant (e.g., $10,000) into the user's active account ID, and update the balance shown on screen.

If below 80, skip the deposit and display a "No Funding Awarded" message alongside the score breakdown.





