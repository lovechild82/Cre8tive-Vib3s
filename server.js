import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

/* FIX: allow all origins (prevents Vercel connection error) */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

/* Chat endpoint */
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ reply: "No messages provided" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      reply: "Server error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
