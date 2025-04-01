import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = 9001;

app.use(express.json());

const openai = new OpenAI({
  apiKey: "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",
});

app.post("/ask-to-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "❌ Please provide a prompt." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.response?.data || error.message);
    
    res.status(500).json({
      error: "❌ Failed to connect to OpenAI API.",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
