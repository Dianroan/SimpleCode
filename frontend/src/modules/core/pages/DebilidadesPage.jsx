import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getTopWeaknessesApi } from "@services/api/weaknesses";

export default function DebilidadesPage() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const resp = await getTopWeaknessesApi();
        if (!mounted) return;
        setData(resp || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = data.map((d) => d.name);
    const values = data.map((d) => d.value);

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Puntaje de debilidad",
            data: values,
            backgroundColor: "rgba(255,99,132,0.6)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return (
    <div className="p-3">
      <h3>Debilidades</h3>
      <p className="text-muted">
        Aquí se muestran los temas en los que tienes más dificultades.
      </p>

      {loading ? (
        <div>Cargando...</div>
      ) : data.length === 0 ? (
        <div>
          No hay datos suficientes. Realiza más ejercicios para obtener un
          análisis más preciso.
        </div>
      ) : (
        <div style={{ maxWidth: 800 }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
}
