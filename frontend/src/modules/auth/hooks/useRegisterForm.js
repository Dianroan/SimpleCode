// Mensajes en español; sin "name"
import { useState, useCallback } from "react";
import { s, isEmail, isUsername, minLen } from "@utils/validate.js";

export default function useRegisterForm({ onSubmit } = {}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const required = (f) => `${f} es obligatorio.`;

  const setField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }, []);

  const handleChange = useCallback(
    (field) => (e) => setField(field, e.target.value),
    [setField]
  );

  const validate = useCallback(() => {
    const er = {};
    const username = s(form.username);
    const email = s(form.email);
    const password = s(form.password);
    const confirm = s(form.confirm);

    if (!username) er.username = required("El nombre de usuario");
    else if (!isUsername(username))
      er.username = "Usa 3+ caracteres: letras, números, . _ -";

    if (!email) er.email = required("El correo");
    else if (!isEmail(email)) er.email = "Correo inválido.";

    if (!password) er.password = required("La contraseña");
    else if (!minLen(password, 6))
      er.password = "La contraseña debe tener al menos 6 caracteres.";

    if (!confirm) er.confirm = required("La confirmación");
    else if (password && confirm && password !== confirm)
      er.confirm = "Las contraseñas no coinciden.";

    setErrors(er);
    return Object.keys(er).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!validate()) return;
      try {
        setSubmitting(true);
        const payload = {
          username: s(form.username),
          email: s(form.email),
          password: s(form.password),
        };
        await onSubmit?.(payload);
      } finally {
        setSubmitting(false);
      }
    },
    [form, onSubmit, validate]
  );

  return {
    form,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    setField,
    setErrors,
  };
}
