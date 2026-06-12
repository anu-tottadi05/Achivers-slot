import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { EVENTS, STALLS, CAMPUSES, FAQ_DATA } from "./src/data";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY is not defined. The AI assistant will run in fallback mock mode.");
}

// System Instruction for the AI Agent
const SYSTEM_INSTRUCTION = `You are the friendly, professional, and student-centric AI Assistant for "Achievers Slot", a premium college event management platform. 
Your goals:
1. Answer event-related questions based on the event catalog.
2. Guide users to specific venues (e.g., Room B13, Seminar Hall B, Main Open Air Theatre).
3. Offer schedule information, dates, and times.
4. Help guide users with event registrations (tell them to click the "Register" button on the card, or explain the procedure).
5. Recommend specific events or stalls based on user interests, branches (e.g., CSE, Mechanical, Arts, Sports), or vibes (e.g., food lovers, technology enthusiasts, music lovers).

Here is the event catalog, campus list, and active stalls data to ground your answers:

CAMPUSES:
${JSON.stringify(CAMPUSES, null, 2)}

EVENTS:
${JSON.stringify(EVENTS.map(ev => ({
  id: ev.id,
  name: ev.name,
  category: ev.category,
  date: ev.date,
  time: ev.time,
  venue: ev.venue,
  campusName: CAMPUSES.find(c => c.id === ev.campusId)?.name || 'Unknown',
  description: ev.description,
  schedule: ev.schedule,
  organizer: ev.organizer
})), null, 2)}

STALLS Available:
${JSON.stringify(STALLS.map(st => ({
  id: st.id,
  name: st.name,
  category: st.category,
  description: st.description,
  location: st.location,
  likesCount: st.likes,
  ratingAvg: st.feedbacks.length > 0 ? (st.feedbacks.reduce((acc, f) => acc + f.rating, 0) / st.feedbacks.length).toFixed(1) : "No rating yet"
})), null, 2)}

FAQs:
${JSON.stringify(FAQ_DATA, null, 2)}

Instructions:
- Keep your answers welcoming, concise, accurate, and structured with clean bullet points or bold markers where useful.
- If the user asks about an event not in the list, politely apologize and suggest checking one of the active events of VIIT, VIT Pune, KITE, or Apex.
- If the requested location or route is tricky, provide quick tips (e.g., "Room B13 is located on the 3rd Floor of the Vignan Vance building").
- Adopt a supportive, student-friendly tone! Never hallucinate organizers or contact details. Relight their campus energy!`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Chat completion with Gemini SDK
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // Return a professional offline mock response if GEMINI_API_KEY is not configured yet
      const fallbackReplies = [
        "That sounds exciting! I am ready to guide you around VIIT, VIT Pune, Apex, and KITE campuses. Since my AI connection key is currently loading, could you check out our active 'Yuvtarang 2026' or 'Mechano-Hack 2.0' in the listing panels?",
        "I'd love to assist you! For registrations, please tap the immediate 'Register' button on the event cards. That auto-generates your pass!",
        "Our stalls section contains incredibly delicious Food stalls, VR hubs, and DIY Anime Merchandise stalls. Tap an event's card above to explore the local bazaar!",
        "Yes, absolutely. The events are filtered by City, respective College campus, date, and general category seamlessly in our visual filters above."
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ response: randomReply });
    }

    // Prepare contents including conversation context
    // We format the prompt with system instructions as recommended.
    const contents: any[] = [];
    
    // Add history if present to keep the assistant conversational
    if (history && Array.isArray(history)) {
      history.slice(-8).forEach((h: any) => {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    // Append the latest user query
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I was unable to formulate a response. How else can I help you today?";
    res.json({ response: replyText });

  } catch (error: any) {
    console.error("Gemini API Error: ", error);
    res.status(500).json({ 
      error: "An error occurred with high-performance Gemini API", 
      details: error.message || error 
    });
  }
});

// Implement Vite middleware or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Listen to host 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Achievers Slot] Full-stack Server listening at http://localhost:${PORT}`);
  });
}

startServer();
export default app;
