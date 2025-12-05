import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  getTopWeaknessesApi,
  getWeaknessesByCategoryApi,
} from "@services/api/weaknesses";

export default function DebilidadesPage() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const radarChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [topWeaknesses, categories] = await Promise.all([
          getTopWeaknessesApi(),
          getWeaknessesByCategoryApi(),
        ]);
        if (!mounted) return;
        setData(topWeaknesses || []);
        setCategoryData(categories || []);
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

  // Gráfica de barras (existente)
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

  // Gráfica de radar (nueva)
  useEffect(() => {
    if (!radarCanvasRef.current || data.length === 0) return;

    if (radarChartRef.current) {
      radarChartRef.current.destroy();
      radarChartRef.current = null;
    }

    const labels = data.slice(0, 6).map((d) => d.name);
    const values = data.slice(0, 6).map((d) => d.value);

    const ctx = radarCanvasRef.current.getContext("2d");
    radarChartRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            label: "Puntos Débiles",
            data: values,
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,0.2)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
        },
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (radarChartRef.current) radarChartRef.current.destroy();
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
        <>
          {/* Contenedor de gráficas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            {/* Gráfica de barras */}
            <div style={{ maxWidth: "500px" }}>
              <h5 style={{ marginBottom: "15px" }}>Análisis de debilidades</h5>
              <canvas ref={canvasRef} />
            </div>

            {/* Gráfica de radar */}
            <div style={{ maxWidth: "500px" }}>
              <h5 style={{ marginBottom: "15px" }}>Puntos Débiles</h5>
              <canvas ref={radarCanvasRef} />
            </div>
          </div>

          {/* Sección de tipos de programas con debilidades */}
          {categoryData.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h5 style={{ marginBottom: "20px" }}>
                Fallastes en los siguientes tipos de programas
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                }}
              >
                {categoryData.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      padding: "15px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h6
                        style={{
                          margin: "0",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {category.title}
                      </h6>
                      <span
                        style={{
                          backgroundColor: "#ff6384",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {category.total_weakness}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
