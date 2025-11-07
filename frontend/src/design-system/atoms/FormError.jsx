export default function FormError({ children }) {
  if (!children) return null;
  return <div className="invalid-feedback d-block">{children}</div>;
}
