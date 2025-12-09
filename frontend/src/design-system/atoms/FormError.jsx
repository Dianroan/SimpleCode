/**
 * Componente FormError - Mensaje de error de validación
 *
 * Muestra mensajes de error debajo de los campos de formulario
 * Se oculta automáticamente si no hay mensaje
 */

export default function FormError({ children }) {
  if (!children) return null;
  return <div className="invalid-feedback d-block">{children}</div>;
}
