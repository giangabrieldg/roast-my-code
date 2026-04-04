require("dotenv").config();
const express = require("express");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

// ── Groq client ────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── System prompt ──────────────────────────────────────────
const SYSTEM_PROMPT = `You are a ruthlessly funny (but ultimately helpful) senior developer who reviews code like a roast comedian at an open-mic night. 

When given code, respond ONLY with valid JSON in this exact structure:
{
  "roast": "A savage, witty, humorous roast of the code. Be creative, funny, and brutally honest. 2-4 sentences.",
  "suggestions": "Actionable, specific improvements the developer can make. Be helpful and constructive. Use numbered points.",
  "explanation": "A clear technical explanation of what the code actually does, any bugs or issues, and its overall quality assessment. Be objective."
}

Rules:
- The roast should be funny but NOT mean-spirited or offensive. Punch at the code, not the person.
- Suggestions must be practical and specific to the actual code given.
- Explanation must be technically accurate.
- Do NOT include any text outside the JSON object.
- Do NOT wrap in markdown code fences.`;

// ── Route: POST /api/roast ─────────────────────────────────
app.post("/api/roast", async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string" || code.trim().length < 5) {
    return res.status(400).json({ error: "No code provided." });
  }

  if (code.length > 8000) {
    return res.status(400).json({
      error: "Code is too long. Please keep it under ~8000 characters.",
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Free & fast on Groq
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Here is the code to roast:\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.85,
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content || "";

    // Parse JSON safely
    let parsed;
    try {
      // Strip potential markdown fences just in case
      const clean = raw
        .replace(/^```json\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      // If JSON parse fails, return the raw text under roast
      parsed = {
        roast: raw,
        suggestions: "Could not parse structured response.",
        explanation: "Could not parse structured response.",
      };
    }

    return res.json({
      roast: parsed.roast || "No roast generated.",
      suggestions: parsed.suggestions || "No suggestions generated.",
      explanation: parsed.explanation || "No explanation generated.",
    });
  } catch (err) {
    console.error("Groq API error:", err?.message || err);

    if (err?.status === 401) {
      return res
        .status(500)
        .json({ error: "Invalid API key. Check your .env file." });
    }
    if (err?.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limit hit. Try again in a moment." });
    }

    return res
      .status(500)
      .json({ error: "AI service error. Please try again." });
  }
});

// ── Fallback: serve index.html ─────────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nRoast My Code is running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
