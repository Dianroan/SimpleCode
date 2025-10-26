export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const cls = `btn btn-${variant} ${className}`.trim();
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
