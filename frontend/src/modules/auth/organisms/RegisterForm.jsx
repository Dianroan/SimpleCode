import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";
import useRegisterForm from "@modules/auth/hooks/useRegisterForm.js";

export default function RegisterForm({ onSubmit }) {
  const { form, errors, submitting, handleChange, handleSubmit } =
    useRegisterForm({ onSubmit });

  return (
    <Card title="Crear cuenta" className="h-100">
      <form noValidate onSubmit={handleSubmit}>
        <TextField
          id="reg-username"
          label="Nombre de usuario"
          value={form.username}
          onChange={handleChange("username")}
          placeholder="tu.usuario"
          error={errors.username}
        />
        <TextField
          id="reg-email"
          label="Correo"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="tucorreo@ejemplo.com"
          error={errors.email}
        />
        <TextField
          id="reg-password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder="••••••••"
          error={errors.password}
        />
        <TextField
          id="reg-confirm"
          label="Confirmar contraseña"
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
          {submitting ? "Creando..." : "Crear cuenta"}
        </Button>
      </form>
    </Card>
  );
}
