import { useEffect, useState } from "react";
import { meApi } from "@services/api/auth.js";

export default function DashboardPage() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await meApi();
        setMe(data);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  return (
    <div className="container py-4">
      <h1>Panel</h1>
      {err && <div className="alert alert-danger mt-3">{err}</div>}
      {me ? (
        <div className="mt-3">
          <p>
            <strong>Usuario:</strong> {me.username}
          </p>
          <p>
            <strong>Correo:</strong> {me.email}
          </p>
        </div>
      ) : (
        !err && <p className="text-muted mt-3">Cargando...</p>
      )}
    </div>
  );
}
