// src/modules/auth/organisms/LoginForm.jsx
import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";
import useLoginForm from "@modules/auth/hooks/useLoginForm.js";

export default function LoginForm({ onSubmit }) {
  const { form, errors, submitting, handleChange, handleSubmit } = useLoginForm(
    { onSubmit }
  );

  return (
    <Card title="Log in" className="h-100">
      <form noValidate onSubmit={handleSubmit}>
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
        <Button type="submit" className="w-100" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
