export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path d="M24 4 44 41H4L24 4Z" />
          <path d="M24 15 35 36H13L24 15Z" />
          <path d="M24 22v14M18 29h12" />
          <circle cx="24" cy="5" r="2.2" />
        </svg>
      </div>
      {!compact && (
        <div className="brand-copy">
          <strong>KAS <span>AI</span></strong>
          <small>L'ÉVEIL</small>
        </div>
      )}
    </div>
  );
}
