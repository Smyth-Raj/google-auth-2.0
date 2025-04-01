import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "Hi , what is real meaning of Life "},
  ],
});

completion.then((result) => console.log(result.choices[0].message));