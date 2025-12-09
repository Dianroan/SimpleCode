/**
 * Hook para manejar el formulario de inicio de sesión
 * 
 * Gestiona:
 * - Estado del formulario (username, password)
 * - Validación de campos
 * - Envío de datos al backend
 * - Mensajes de error
 * 
 * @param {Function} onSubmit - Callback al enviar el formulario válido
 * @returns {Object} { form, errors, submitting, handleChange, handleSubmit }
 */

import { useState, useCallback } from "react";
import { s, isUsername, requiredMsg as _req } from "@utils/validate.js";

export default function useLoginForm({ onSubmit } = {}) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const requiredMsg = (field) => `${field} es obligatorio.`;

  const setField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }, []);

  const handleChange = useCallback(
    (field) => (e) => setField(field, e.target.value),
    [setField]
  );

  /**
   * Valida los campos del formulario
   * - username: Requerido, formato válido (3+ caracteres)
   * - password: Requerido
   */
  const validate = useCallback(() => {
    const er = {};
    const username = s(form.username);
    const password = s(form.password);

    if (!username) er.username = requiredMsg("El nombre de usuario");
    else if (!isUsername(username))
      er.username = "Usa 3+ caracteres: letras, números, . _ -";

    if (!password) er.password = requiredMsg("La contraseña");

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
