import { MessageSquare, Plus, Trash2, X, Sparkles } from "lucide-react";
import Brand from "./Brand";
import { formatConversationDate } from "../lib/utils";

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  mobileOpen,
  onClose
}) {
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" aria-label="Fermer le menu" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Fermer le menu">
            <X size={18} />
          </button>
        </div>

        <button className="new-chat-button" onClick={() => { onNew(); onClose(); }}>
          <Plus size={17} />
          <span>Nouvelle conversation</span>
          <span className="new-chat-shortcut">＋</span>
        </button>

        <div className="history-label">HISTORIQUE</div>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <p className="empty-history">Aucune conversation pour le moment.</p>
          ) : conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeId === conversation.id ? "active" : ""}`}
            >
              <button className="conversation-select" onClick={() => { onSelect(conversation.id); onClose(); }}>
                <MessageSquare size={15} />
                <span className="conversation-title">{conversation.title || "Nouvelle conversation"}</span>
                <time>{formatConversationDate(conversation.updatedAt)}</time>
              </button>
              <button
                className="delete-conversation"
                aria-label="Supprimer la conversation"
                title="Supprimer"
                onClick={() => onDelete(conversation.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="note-icon"><Sparkles size={15} /></div>
            <div>
              <strong>Un esprit. Des idées.</strong>
              <span>Votre assistant francophone.</span>
            </div>
          </div>
          <div className="sidebar-footer">
            <span className="status-dot" />
            <span>Interface KAS AI v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
