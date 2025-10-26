import LoginForm from "@modules/auth/organisms/LoginForm.jsx";
import RegisterForm from "@modules/auth/organisms/RegisterForm.jsx";

export default function App() {
  // ...
  const handleLogin = (data) => {
    console.log("LOGIN submit:", data);
    alert(`Login OK: ${data.username}`);
  };
  // ...

  const handleRegister = (data) => {
    console.log("REGISTER submit:", data);
    alert(`Register OK: ${data.email}`);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Pantalla de pruebas</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <LoginForm onSubmit={handleLogin} />
        </div>
        <div className="col-12 col-lg-6">
          <RegisterForm onSubmit={handleRegister} />
        </div>
      </div>
    </div>
  );
}
