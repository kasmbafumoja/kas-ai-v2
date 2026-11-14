import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import Composer from "./components/Composer";
import Welcome from "./components/Welcome";
import useConversations from "./hooks/useConversations";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const bottomRef = useRef(null);
  const {
    conversations,
    activeId,
    activeConversation,
    isSending,
    newConversation,
    selectConversation,
    deleteConversation,
    sendMessage
  } = useConversations();

  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeId, messages.length, isSending]);

  return (
    <main className="app-shell">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={newConversation}
        onDelete={deleteConversation}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <section className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-button" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
              <Menu size={20} />
            </button>
            <div className="mobile-brand">KAS <span>AI</span></div>
            <div className="topbar-divider" />
            <span className="topbar-section">Assistant conversationnel</span>
          </div>
          <div className="topbar-right">
            <span className="connection-indicator">
              <span className="status-dot" />
              API configurée
            </span>
            <span className="version-tag">V2.0</span>
          </div>
        </header>

        <div className={`chat-scroll ${hasMessages ? "chat-scroll-active" : ""}`}>
          {!hasMessages ? (
            <Welcome onSuggestion={sendMessage} />
          ) : (
            <div className="messages-container">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSending && (
                <div className="message-row message-assistant typing-row">
                  <div className="message-avatar avatar-ai">
                    <span className="mini-sigil">K</span>
                  </div>
                  <div className="typing-content">
                    <strong>KAS AI</strong>
                    <div className="typing-indicator"><i /><i /><i /></div>
                    <span>Réflexion en cours…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <footer className="composer-area">
          <Composer onSend={sendMessage} disabled={isSending} />
        </footer>
      </section>
    </main>
  );
}
