export default function Card({ title, children, footer, className = "" }) {
  return (
    <div className={`card shadow-sm ${className}`.trim()}>
      {title && <div className="card-header bg-white fw-semibold">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer bg-white">{footer}</div>}
    </div>
  );
}
