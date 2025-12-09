export default function Button({
  children,
  variant = "primary",
  className = "",
  gradient = false,
  ...props
}) {
  // Estilos base para todos los botones
  const baseStyles = {
    fontWeight: "600",
    borderRadius: "0.75rem",
    padding: "0.625rem 1.5rem",
    border: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  };

  // Estilos específicos por variante
  const variantStyles = {
    primary: gradient
      ? {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
        }
      : {},
    success: gradient
      ? {
          background: "linear-gradient(135deg, #10b981 0%, #22d3ee 100%)",
          color: "white",
          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
        }
      : {},
    warning: gradient
      ? {
          background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
          color: "white",
          boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
        }
      : {},
    danger: gradient
      ? {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
        }
      : {},
  };

  const combinedStyles = {
    ...baseStyles,
    ...(variantStyles[variant] || {}),
  };

  const cls = `btn btn-${variant} hover-lift ${className}`.trim();

  return (
    <button className={cls} style={combinedStyles} {...props}>
      {children}
    </button>
  );
}
