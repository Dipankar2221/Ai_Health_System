import { generateChatBot } from "../services/aiServices.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const aiText = await generateChatBot(message);

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = { reply: aiText, questions: [] };
    }

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};