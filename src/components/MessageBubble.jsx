import { Bot, User, AlertTriangle, Copy, Check } from "lucide-react";
import { useState } from "react";
import Brand from "./Brand";
import { formatTime } from "../lib/utils";

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    } catch {
      // La copie peut être bloquée par certains navigateurs.
    }
  }

  return (
    <article className={`message-row ${isUser ? "message-user" : "message-assistant"} ${message.isError ? "message-error" : ""}`}>
      <div className={`message-avatar ${isUser ? "avatar-user" : "avatar-ai"}`}>
        {isUser ? <User size={17} /> : <Brand compact />}
      </div>
      <div className="message-body">
        <div className="message-meta">
          <strong>{isUser ? "Vous" : "KAS AI"}</strong>
          <time>{formatTime(message.timestamp)}</time>
          {message.isError && <span className="error-label"><AlertTriangle size={12} /> Erreur</span>}
        </div>
        <div className="message-content">{message.content}</div>
        {!isUser && !message.isError && (
          <button className="copy-button" onClick={copyMessage} title="Copier la réponse">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copié" : "Copier"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
