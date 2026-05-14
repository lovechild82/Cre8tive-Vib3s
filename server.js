import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

/* Allow frontend requests */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* OpenAI client */
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

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        reply: "Invalid request format"
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("OpenAI error:", err);

    res.status(500).json({
      reply: "Server error"
    });
  }
});

/* Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
