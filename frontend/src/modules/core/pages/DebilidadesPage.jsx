import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  getTopWeaknessesApi,
  getWeaknessesByCategoryApi,
  getFailedExercisesApi,
} from "@services/api/weaknesses";

export default function DebilidadesPage() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const radarChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [failedExercises, setFailedExercises] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [topWeaknesses, categories, exercises] = await Promise.all([
          getTopWeaknessesApi(),
          getWeaknessesByCategoryApi(),
          getFailedExercisesApi(),
        ]);
        if (!mounted) return;
        setData(topWeaknesses || []);
        setCategoryData(categories || []);
        setFailedExercises(exercises || []);
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

  // Gráfica de barras con colores diferentes para cada barra
  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = data.map((d) => d.name);
    const values = data.map((d) => d.value);

    // Array de colores vibrantes para cada barra
    const vibrantColors = [
      "rgba(255, 99, 132, 0.8)", // Rosa
      "rgba(54, 162, 235, 0.8)", // Azul
      "rgba(255, 206, 86, 0.8)", // Amarillo
      "rgba(75, 192, 192, 0.8)", // Verde agua
      "rgba(153, 102, 255, 0.8)", // Púrpura
      "rgba(255, 159, 64, 0.8)", // Naranja
      "rgba(236, 72, 153, 0.8)", // Magenta
      "rgba(59, 130, 246, 0.8)", // Azul cielo
    ];

    const borderColors = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(236, 72, 153, 1)",
      "rgba(59, 130, 246, 1)",
    ];

    const backgroundColors = values.map(
      (_, i) => vibrantColors[i % vibrantColors.length]
    );
    const borderColorArray = values.map(
      (_, i) => borderColors[i % borderColors.length]
    );

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Puntaje de debilidad",
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColorArray,
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  // Gráfica de radar (mejorada)
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
            borderColor: "rgba(236, 72, 153, 1)",
            backgroundColor: "rgba(236, 72, 153, 0.15)",
            pointBackgroundColor: "rgba(236, 72, 153, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(236, 72, 153, 1)",
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                size: 13,
                weight: "600",
              },
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            pointLabels: {
              font: {
                size: 12,
                weight: "600",
              },
            },
            ticks: {
              backdropColor: "transparent",
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });

    return () => {
      if (radarChartRef.current) radarChartRef.current.destroy();
    };
  }, [data]);

  return (
    <div className="container-fluid p-4 animate-fade-in">
      <div className="mb-5">
        <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
          <span style={{ marginRight: '0.5rem' }}>📊</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Debilidades
          </span>
        </h1>
        <p className="text-muted">
          Aquí se muestran los temas en los que tienes más dificultades.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Analizando tus debilidades...</p>
        </div>
      ) : data.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(244, 114, 182, 0.05) 100%)",
            borderRadius: "1.5rem",
            padding: "3rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📈</div>
          <h4 className="mb-2">No hay datos suficientes</h4>
          <p className="text-muted">
            Realiza más ejercicios para obtener un análisis más preciso.
          </p>
        </div>
      ) : (
        <>
          {/* Contenedor de gráficas */}
          <div className="row g-4 mb-5">
            {/* Gráfica de barras */}
            <div className="col-12 col-lg-6">
              <div
                className="card hover-lift h-100"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  padding: "2rem",
                }}
              >
                <h5
                  className="fw-bold mb-4"
                  style={{
                    color: "#ec4899",
                    fontSize: "1.25rem",
                  }}
                >
                  📊 Análisis de debilidades
                </h5>
                <div style={{ height: "400px", position: "relative" }}>
                  <canvas ref={canvasRef} />
                </div>
              </div>
            </div>

            {/* Gráfica de radar */}
            <div className="col-12 col-lg-6">
              <div
                className="card hover-lift h-100"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  padding: "2rem",
                }}
              >
                <h5
                  className="fw-bold mb-4"
                  style={{
                    color: "#ec4899",
                    fontSize: "1.25rem",
                  }}
                >
                  🎯 Puntos Débiles
                </h5>
                <div style={{ height: "400px", position: "relative" }}>
                  <canvas ref={radarCanvasRef} />
                </div>
              </div>
            </div>
          </div>

          {/* Sección de ejercicios fallidos */}
          {failedExercises.length > 0 && (
            <div>
              <h5
                className="fw-bold mb-4"
                style={{
                  color: "#1f2937",
                  fontSize: "1.5rem",
                }}
              >
                ⚠️ Fallastes en los siguientes tipos de programas
              </h5>
              <div className="row g-3">
                {failedExercises.map((exercise, index) => {
                  const colors = [
                    {
                      bg: "rgba(239, 68, 68, 0.1)",
                      border: "#ef4444",
                      text: "#dc2626",
                    },
                    {
                      bg: "rgba(245, 158, 11, 0.1)",
                      border: "#f59e0b",
                      text: "#d97706",
                    },
                    {
                      bg: "rgba(236, 72, 153, 0.1)",
                      border: "#ec4899",
                      text: "#db2777",
                    },
                    {
                      bg: "rgba(99, 102, 241, 0.1)",
                      border: "#6366f1",
                      text: "#4f46e5",
                    },
                  ];
                  const colorScheme = colors[index % colors.length];

                  return (
                    <div key={exercise.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        className="card hover-lift h-100"
                        style={{
                          padding: "1.25rem",
                          borderRadius: "1rem",
                          border: `2px solid ${colorScheme.border}`,
                          background: colorScheme.bg,
                          transition: "all 0.25s ease",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <h6
                            style={{
                              margin: "0",
                              fontSize: "1rem",
                              fontWeight: "700",
                              color: colorScheme.text,
                              flex: 1,
                            }}
                          >
                            {exercise.title}
                          </h6>
                          <span
                            style={{
                              background: `linear-gradient(135deg, ${colorScheme.border}, ${colorScheme.text})`,
                              color: "white",
                              padding: "6px 16px",
                              borderRadius: "50px",
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              boxShadow: `0 4px 12px ${colorScheme.border}40`,
                              marginLeft: "0.75rem",
                            }}
                          >
                            {exercise.failure_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
