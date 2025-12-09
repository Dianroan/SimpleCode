/**
 * Componente Label - Etiqueta para campos de formulario
 *
 * Asocia texto descriptivo con campos Input usando htmlFor
 */

export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`form-label ${className}`.trim()}>
      {children}
    </label>
  );
}
