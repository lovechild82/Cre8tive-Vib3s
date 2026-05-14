import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// --------------------
// CHAT ENDPOINT
// --------------------
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI inside a SaaS platform." },
        ...messages
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat request failed" });
  }
});


// --------------------
// IMAGE GENERATION ENDPOINT
// --------------------
app.post("/api/image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    res.json({
      image: response.data[0].url
    });

  } catch (err) {
    console.error("Image error:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});


// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("Cre8tive Vib3s backend is running");
});


// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
