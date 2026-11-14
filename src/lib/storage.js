import { makeId } from "./utils";

const CONVERSATIONS_KEY = "kas-ai-v2-conversations";
const ACTIVE_KEY = "kas-ai-v2-active";

export function createConversation() {
  const now = new Date().toISOString();
  return {
    id: makeId(),
    title: "Nouvelle conversation",
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

export function loadConversations() {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        Array.isArray(item.messages)
    );
  } catch {
    return [];
  }
}

export function saveConversations(conversations) {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch {
    // Le chat reste utilisable si le stockage du navigateur est désactivé.
  }
}

export function loadActiveId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveActiveId(id) {
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // Ignore les erreurs de stockage.
  }
}
