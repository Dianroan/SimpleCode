/**
 * Componente Input - Campo de entrada con validación visual
 *
 * Cambia de estilo automáticamente cuando hay errores de validación
 *
 * @param {boolean} isInvalid - Si el campo tiene error (muestra borde rojo)
 */

export default function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  isInvalid = false,
  className = "",
  ...props
}) {
  const inputStyles = {
    borderRadius: "0.75rem",
    border: isInvalid ? "2px solid #ef4444" : "2px solid #e5e7eb",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    backgroundColor: isInvalid ? "rgba(239, 68, 68, 0.05)" : "white",
  };

  const cls = `form-control ${
    isInvalid ? "is-invalid" : ""
  } ${className}`.trim();

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cls}
      style={inputStyles}
      {...props}
    />
  );
}
