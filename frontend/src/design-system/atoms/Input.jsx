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
      {...props}
    />
  );
}
