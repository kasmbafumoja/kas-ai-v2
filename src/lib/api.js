import { API_URL } from "../config";
import { PERSONA } from "./persona";

const REQUEST_TIMEOUT_MS = 60000;
const MAX_CONTEXT_MESSAGES = 10;
const MAX_CONTEXT_CHARS = 12000;

function buildApiMessage(history, latestMessage) {
  const usableHistory = (history || [])
    .filter((item) => item && !item.isError && item.content)
    .slice(-MAX_CONTEXT_MESSAGES);

  let context = usableHistory
    .map((item) => `${item.role === "assistant" ? "Assistant" : "Utilisateur"} : ${item.content}`)
    .join("\n\n");

  if (context.length > MAX_CONTEXT_CHARS) {
    context = context.slice(-MAX_CONTEXT_CHARS);
  }

  return [
    PERSONA,
    context ? `HISTORIQUE RÉCENT :\n${context}` : "",
    `NOUVEAU MESSAGE DE L'UTILISATEUR :\n${latestMessage}`,
    "Réponds au dernier message en tenant compte de l'historique ci-dessus."
  ]
    .filter(Boolean)
    .join("\n\n");
}

function extractText(value, depth = 0) {
  if (depth > 6 || value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => extractText(item, depth + 1)).filter(Boolean).join("\n");
  }
  if (typeof value !== "object") return "";

  const directKeys = [
    "reply",
    "response",
    "answer",
    "content",
    "text",
    "output",
    "message",
    "result"
  ];

  for (const key of directKeys) {
    if (key in value) {
      const found = extractText(value[key], depth + 1);
      if (found) return found;
    }
  }

  if (Array.isArray(value.choices) && value.choices[0]) {
    const choice = value.choices[0];
    const found =
      extractText(choice.message?.content, depth + 1) ||
      extractText(choice.text, depth + 1);
    if (found) return found;
  }

  if (value.data !== undefined) {
    const found = extractText(value.data, depth + 1);
    if (found) return found;
  }

  return "";
}

function parseResponseBody(rawText) {
  const raw = String(rawText || "").trim();
  if (!raw) return "";

  if (raw.startsWith("data:")) {
    const chunks = raw
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .filter((line) => line && line !== "[DONE]");

    const pieces = chunks.map((chunk) => {
      try {
        return extractText(JSON.parse(chunk));
      } catch {
        return chunk;
      }
    }).filter(Boolean);

    if (pieces.length) return pieces.join("");
  }

  try {
    const parsed = JSON.parse(raw);
    return extractText(parsed) || raw;
  } catch {
    return raw;
  }
}

export async function sendChatMessage({ history = [], message }) {
  if (!API_URL) {
    throw new Error("L'adresse de l'API n'est pas configurée.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, text/event-stream"
      },
      body: JSON.stringify({
        message: buildApiMessage(history, message)
      }),
      signal: controller.signal
    });

    const rawText = await response.text();
    const answer = parseResponseBody(rawText);

    if (!response.ok) {
      const detail = answer || `Erreur HTTP ${response.status}`;
      throw new Error(detail);
    }

    if (!answer) {
      throw new Error("L'API a répondu, mais aucun texte n'a été trouvé dans sa réponse.");
    }

    return answer;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("La demande a pris trop de temps. Réessaie dans un instant.");
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Connexion impossible. Vérifie Internet et les autorisations CORS de l'API Vercel."
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
