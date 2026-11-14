import { Code2, Lightbulb, Languages, PenLine, Sparkles } from "lucide-react";

const suggestions = [
  { icon: Lightbulb, title: "Comprendre un sujet", text: "Explique-moi un sujet simplement, avec des exemples." },
  { icon: Code2, title: "Créer du code", text: "Aide-moi à créer un petit projet web étape par étape." },
  { icon: PenLine, title: "Améliorer un texte", text: "Aide-moi à corriger et améliorer un texte en français." },
  { icon: Languages, title: "Traduire", text: "Traduis ce texte en anglais et explique les expressions difficiles." }
];

export default function Welcome({ onSuggestion }) {
  return (
    <div className="welcome">
      <div className="welcome-orb">
        <div className="orb-ring ring-one" />
        <div className="orb-ring ring-two" />
        <div className="orb-core"><Sparkles size={29} /></div>
      </div>
      <div className="welcome-eyebrow"><span /> SYSTÈME EN LIGNE <span /></div>
      <h1>Les idées prennent<br /><em>une nouvelle forme.</em></h1>
      <p className="welcome-description">
        Je suis KAS AI. Posez une question, partagez une idée ou commencez un projet.
        Nous allons avancer étape par étape.
      </p>
      <div className="suggestion-grid">
        {suggestions.map(({ icon: Icon, title, text }) => (
          <button className="suggestion-card" key={title} onClick={() => onSuggestion(text)}>
            <span className="suggestion-icon"><Icon size={17} /></span>
            <strong>{title}</strong>
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
