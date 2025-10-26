import { useState } from "react";
import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";

export default function LoginForm({ onSubmit }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.username) er.username = "Username is required.";
    // Regla opcional (mín. 3 chars, letras, números y . _ -)
    else if (!/^[a-zA-Z0-9._-]{3,}$/.test(form.username))
      er.username = "Use 3+ chars: letters, numbers, . _ -";
    if (!form.password) er.password = "Password is required.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  };

  return (
    <Card title="Log in" className="h-100">
      <form noValidate onSubmit={submit}>
        <TextField
          id="login-username"
          label="Username"
          value={form.username}
          onChange={handleChange("username")}
          placeholder="your.username"
          error={errors.username}
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder="••••••••"
          error={errors.password}
        />
        <Button type="submit" className="w-100">
          Sign in
        </Button>
      </form>
    </Card>
  );
}
