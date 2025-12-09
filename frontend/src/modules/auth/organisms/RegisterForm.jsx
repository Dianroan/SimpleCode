import Card from "@ds/atoms/Card.jsx";
import TextField from "@ds/molecules/TextField.jsx";
import Button from "@ds/atoms/Button.jsx";
import useRegisterForm from "@modules/auth/hooks/useRegisterForm.js";

export default function RegisterForm({ onSubmit }) {
  const { form, errors, submitting, handleChange, handleSubmit } =
    useRegisterForm({ onSubmit });

  return (
    <div>
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
          className="w-100"
          disabled={submitting}
          gradient
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            fontSize: "1.05rem",
            background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
          }}
        >
          {submitting ? "Creando..." : "🚀 Crear cuenta"}
        </Button>
      </form>
    </div>
  );
}
