import Label from "@ds/atoms/Label.jsx";
import Input from "@ds/atoms/Input.jsx";
import FormError from "@ds/atoms/FormError.jsx";

export default function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="mb-3">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={Boolean(error)}
      />
      <FormError>{error}</FormError>
    </div>
  );
}
