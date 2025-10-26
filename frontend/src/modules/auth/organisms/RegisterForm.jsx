import { useState } from "react";
import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";

export default function RegisterForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.name) er.name = "Name is required.";
    if (!form.email) er.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) er.email = "Invalid email.";
    if (!form.password) er.password = "Password is required.";
    if (form.password && form.password.length < 6)
      er.password = "Minimum 6 characters.";
    if (!form.confirm) er.confirm = "Please confirm your password.";
    if (form.password && form.confirm && form.password !== form.confirm)
      er.confirm = "Passwords do not match.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  };

  return (
    <Card title="Register" className="h-100">
      <form noValidate onSubmit={submit}>
        <TextField
          id="reg-name"
          label="Full name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Jane Doe"
          error={errors.name}
        />
        <TextField
          id="reg-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="you@example.com"
          error={errors.email}
        />
        <TextField
          id="reg-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder="••••••••"
          error={errors.password}
        />
        <TextField
          id="reg-confirm"
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={handleChange("confirm")}
          placeholder="••••••••"
          error={errors.confirm}
        />
        <Button type="submit" variant="success" className="w-100">
          Create account
        </Button>
      </form>
    </Card>
  );
}
