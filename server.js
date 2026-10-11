
import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";

const app = express();
const PORT = 3000;

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.post("/api/judge", async (req, res) => {
  console.log("1. Pitch received by server.");

  let timeoutId;

  try {
    const { pitch, persona } = req.body;

    if (typeof pitch !== "string" || !pitch.trim()) {
      return res.status(400).json({
        error: "Please enter a startup idea."
      });
    }

    const judges = {
      vc: "Be a brutally honest venture capitalist. Focus on profitability, competition, and risks.",
      hype: "Be an enthusiastic startup coach. Highlight strengths and growth opportunities.",
      analyst: "Be a skeptical business analyst. Challenge assumptions and examine feasibility."
    };

    const judge = judges[persona] || judges.vc;


const prompt = `
${judge}

Evaluate this startup idea fairly and critically:
${pitch.trim()}

Keep your feedback under 300 words.

Score the startup from 0 to 100 using this rubric:
- Problem and customer need: 25 points
- Market opportunity: 20 points
- Business model and revenue: 20 points
- Differentiation and competition: 20 points
- Feasibility and growth strategy: 15 points

Explain the score using specific details from the pitch.
Do not automatically penalize an idea simply because it has competitors,
unproven demand, or risks that early-stage startups commonly face.
Distinguish confirmed weaknesses from assumptions that require validation.
Do not invent market research or claim that a business will fail without evidence.

Use these headings:

SCORE: Give the score out of 100 and explain the main reasons.
STRENGTHS: Two specific strengths.
WEAKNESSES: Two important weaknesses.
MARKET POTENTIAL: Likely customers and realistic opportunities.
NEXT STEPS: Three practical actions to validate or improve the idea.
`;


    console.log("2. Sending request to Gemini...");

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(
          "Gemini took too long to respond. Please try again."
        ));
      }, 25000);
    });

    const aiPromise = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: "low"
        },
        maxOutputTokens: 1000
      }
    });

    const response = await Promise.race([
      aiPromise,
      timeoutPromise
    ]);

    clearTimeout(timeoutId);

    console.log("3. Gemini responded successfully.");

    res.json({
      feedback: response.text || "Gemini returned an empty response."
    });

  } catch (error) {
    console.error("AI request failed:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        error: error.message || "The AI evaluation failed."
      });
    }
  } finally {
    clearTimeout(timeoutId);
  }
});

app.listen(PORT, () => {
console.log(`AuditMyPitch is running at http://localhost:${PORT}`);
});
