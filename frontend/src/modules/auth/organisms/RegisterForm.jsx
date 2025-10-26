// src/modules/auth/organisms/RegisterForm.jsx
import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";
import useRegisterForm from "@modules/auth/hooks/useRegisterForm.js";

export default function RegisterForm({ onSubmit }) {
  const { form, errors, submitting, handleChange, handleSubmit } =
    useRegisterForm({ onSubmit });

  return (
    <Card title="Register" className="h-100">
      <form noValidate onSubmit={handleSubmit}>
        <TextField
          id="reg-name"
          label="Full name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Jane Doe"
          error={errors.name}
        />
        <TextField
          id="reg-username"
          label="Username"
          value={form.username}
          onChange={handleChange("username")}
          placeholder="your.username"
          error={errors.username}
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
        <Button
          type="submit"
          variant="success"
          className="w-100"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create account"}
        </Button>
      </form>
    </Card>
  );
}
