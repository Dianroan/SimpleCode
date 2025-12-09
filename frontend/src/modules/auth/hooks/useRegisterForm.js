/**
 * Hook para manejar el formulario de registro
 * 
 * Gestiona:
 * - Estado del formulario (username, email, password, confirm)
 * - Validación completa de todos los campos
 * - Verificación de coincidencia de contraseñas
 * - Envío de datos al backend
 * 
 * @param {Function} onSubmit - Callback al enviar el formulario válido
 * @returns {Object} { form, errors, submitting, handleChange, handleSubmit }
 */

import { useState, useCallback } from "react";
import {
  s,
  isEmail,
  isUsername,
  minLen,
  requiredMsg,
  minLenMsg,
  usernameMsg,
  emailMsg,
  passwordMismatchMsg,
} from "@utils/validate.js";

export default function useRegisterForm({ onSubmit } = {}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }, []);

  const handleChange = useCallback(
    (field) => (e) => setField(field, e.target.value),
    [setField]
  );

  /**
   * Valida todos los campos del formulario
   * - username: Requerido, formato válido
   * - email: Requerido, formato email válido
   * - password: Requerido, mínimo 6 caracteres
   * - confirm: Requerido, debe coincidir con password
   */
  const validate = useCallback(() => {
    const er = {};
    const username = s(form.username);
    const email = s(form.email);
    const password = s(form.password);
    const confirm = s(form.confirm);

    if (!username) er.username = requiredMsg("El nombre de usuario");
    else if (!isUsername(username)) er.username = usernameMsg;

    if (!email) er.email = requiredMsg("El correo");
    else if (!isEmail(email)) er.email = emailMsg;

    if (!password) er.password = requiredMsg("La contraseña");
    else if (!minLen(password, 6)) er.password = minLenMsg("La contraseña", 6);

    if (!confirm) er.confirm = requiredMsg("La confirmación");
    else if (password !== confirm) er.confirm = passwordMismatchMsg;

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
          confirm: s(form.confirm),
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
