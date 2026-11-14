import { useEffect, useMemo, useRef, useState } from "react";
import { sendChatMessage } from "../lib/api";
import {
  createConversation,
  loadActiveId,
  loadConversations,
  saveActiveId,
  saveConversations
} from "../lib/storage";
import { makeId, titleFromMessage } from "../lib/utils";

function initialConversations() {
  const saved = loadConversations();
  return saved.length ? saved : [createConversation()];
}

export default function useConversations() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(() => loadActiveId());
  const [isSending, setIsSending] = useState(false);
  const sendingRef = useRef(false);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    if (!conversations.some((conversation) => conversation.id === activeId)) {
      const nextId = conversations[0]?.id || "";
      setActiveId(nextId);
      saveActiveId(nextId);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) || null,
    [conversations, activeId]
  );

  function newConversation() {
    const conversation = createConversation();
    setConversations((current) => [conversation, ...current]);
    setActiveId(conversation.id);
    return conversation.id;
  }

  function selectConversation(id) {
    setActiveId(id);
  }

  function deleteConversation(id) {
    const remaining = conversations.filter((conversation) => conversation.id !== id);
    if (remaining.length === 0) {
      const fresh = createConversation();
      setConversations([fresh]);
      setActiveId(fresh.id);
      return;
    }
    setConversations(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  }

  async function sendMessage(rawMessage) {
    const message = String(rawMessage || "").trim();
    if (!message || sendingRef.current) return;

    let target = conversations.find((conversation) => conversation.id === activeId);
    if (!target) {
      target = createConversation();
      setConversations((current) => [target, ...current]);
      setActiveId(target.id);
    }

    const userItem = {
      id: makeId(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    };

    const previousMessages = target.messages || [];
    const nextMessages = [...previousMessages, userItem];

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === target.id
          ? {
              ...conversation,
              title: previousMessages.length === 0 ? titleFromMessage(message) : conversation.title,
              updatedAt: new Date().toISOString(),
              messages: nextMessages
            }
          : conversation
      )
    );

    sendingRef.current = true;
    setIsSending(true);

    try {
      const answer = await sendChatMessage({
        history: previousMessages,
        message
      });

      const assistantItem = {
        id: makeId(),
        role: "assistant",
        content: answer,
        timestamp: new Date().toISOString()
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === target.id
            ? {
                ...conversation,
                updatedAt: new Date().toISOString(),
                messages: [...conversation.messages, assistantItem]
              }
            : conversation
        )
      );
    } catch (error) {
      const errorItem = {
        id: makeId(),
        role: "assistant",
        content: error.message || "Une erreur inconnue est survenue.",
        timestamp: new Date().toISOString(),
        isError: true
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === target.id
            ? {
                ...conversation,
                updatedAt: new Date().toISOString(),
                messages: [...conversation.messages, errorItem]
              }
            : conversation
        )
      );
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  }

  return {
    conversations: [...conversations].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    ),
    activeId,
    activeConversation,
    isSending,
    newConversation,
    selectConversation,
    deleteConversation,
    sendMessage
  };
}
