import { useRef, useState } from "react";
import { ArrowUp, CornerDownLeft, Square } from "lucide-react";
import { MAX_MESSAGE_LENGTH } from "../config";

export default function Composer({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  function submit(event) {
    event?.preventDefault();
    const clean = value.trim();
    if (!clean || disabled) return;
    onSend(clean);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function handleChange(event) {
    setValue(event.target.value.slice(0, MAX_MESSAGE_LENGTH));
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }

  return (
    <form className="composer-wrap" onSubmit={submit}>
      <div className="composer">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message à KAS AI..."
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={disabled}
          aria-label="Votre message"
        />
        <div className="composer-actions">
          <span className="composer-hint"><CornerDownLeft size={13} /> Entrée pour envoyer · Maj + Entrée pour une ligne</span>
          <span className="composer-count">{value.length}/{MAX_MESSAGE_LENGTH}</span>
          <button className="send-button" type="submit" disabled={!value.trim() || disabled} aria-label="Envoyer">
            {disabled ? <Square size={14} fill="currentColor" /> : <ArrowUp size={18} />}
          </button>
        </div>
      </div>
      <p className="disclaimer">KAS AI peut se tromper. Vérifiez les informations importantes.</p>
    </form>
  );
}
