/**
 * Componente Card - Tarjeta contenedora reutilizable
 *
 * Tarjeta con opciones de personalización:
 * - title: Header de la tarjeta
 * - footer: Footer de la tarjeta
 * - gradient: Aplica degradado al fondo y header con colores púrpura
 * - glow: Agrega sombra luminosa azul
 * - className: Clases CSS adicionales
 *
 * @param {string} title - Título opcional del header
 * @param {ReactNode} children - Contenido principal
 * @param {ReactNode} footer - Contenido del footer
 * @param {string} className - Clases CSS adicionales
 * @param {boolean} gradient - Si aplica degradado
 * @param {boolean} glow - Si aplica efecto de brillo
 */

export default function Card({
  title,
  children,
  footer,
  className = "",
  gradient = false,
  glow = false,
}) {
  const cardStyles = {
    borderRadius: "1rem",
    border: "none",
    boxShadow: glow
      ? "0 10px 25px -5px rgba(99, 102, 241, 0.3)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    background: gradient
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
      : "white",
  };

  const headerStyles = {
    background: gradient
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent",
    color: gradient ? "white" : "inherit",
    fontWeight: "600",
    borderBottom: gradient ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
    padding: "1rem 1.25rem",
  };

  return (
    <div className={`card hover-lift ${className}`.trim()} style={cardStyles}>
      {title && (
        <div className="card-header" style={headerStyles}>
          {title}
        </div>
      )}
      <div className="card-body" style={{ padding: "1.25rem" }}>
        {children}
      </div>
      {footer && (
        <div
          className="card-footer"
          style={{
            background: "rgba(248, 250, 252, 0.5)",
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
            padding: "1rem 1.25rem",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
