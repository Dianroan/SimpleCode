import { useState, useCallback } from "react";
import { s, isUsername, requiredMsg, usernameMsg } from "@utils/validate.js";

export default function useLoginForm({ onSubmit } = {}) {
  const [form, setForm] = useState({ username: "", password: "" });
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

  const validate = useCallback(() => {
    const er = {};
    const username = s(form.username);
    const password = s(form.password);

    if (!username) er.username = requiredMsg("Username");
    else if (!isUsername(username)) er.username = usernameMsg;

    if (!password) er.password = requiredMsg("Password");

    setErrors(er);
    return Object.keys(er).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!validate()) return;
      try {
        setSubmitting(true);
        // Normaliza antes de enviar (trim)
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
