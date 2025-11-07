import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";
import useLoginForm from "@modules/auth/hooks/useLoginForm.js";

export default function LoginForm({ onSubmit }) {
  const { form, errors, submitting, handleChange, handleSubmit } = useLoginForm(
    { onSubmit }
  );

  return (
    <Card title="Iniciar sesión" className="h-100">
      <form noValidate onSubmit={handleSubmit}>
        <TextField
          id="login-username"
          label="Nombre de usuario"
          value={form.username}
          onChange={handleChange("username")}
          placeholder="tu.usuario"
          error={errors.username}
        />
        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder="••••••••"
          error={errors.password}
        />
        <Button type="submit" className="w-100" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}
