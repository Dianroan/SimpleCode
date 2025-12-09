/**
 * Componente WeaknessChartsHorizontal - Gráficas de debilidades en layout horizontal
 *
 * Similar a WeaknessCharts pero con disposición lado a lado (2 columnas):
 * - Columna izquierda: Gráfica de radar (top 6 debilidades)
 * - Columna derecha: Gráfica de barras (todas las debilidades)
 *
 * Usado en PerfilPage para mostrar análisis en formato compacto
 */

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { getTopWeaknessesApi } from "@services/api/weaknesses";

export default function WeaknessChartsHorizontal() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const radarChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const topWeaknesses = await getTopWeaknessesApi();
        if (!mounted) return;
        setData(topWeaknesses || []);
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

  // Gráfica de radar
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
            borderColor: "#ec4899",
            backgroundColor: "rgba(236, 72, 153, 0.15)",
            pointBackgroundColor: "#ec4899",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#ec4899",
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
              color: "#1f2937",
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
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.06)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            pointLabels: {
              color: "#4b5563",
              font: {
                size: 11,
                weight: "600",
              },
            },
            ticks: {
              color: "#9ca3af",
              backdropColor: "transparent",
            },
          },
        },
      },
    });

    return () => {
      if (radarChartRef.current) radarChartRef.current.destroy();
    };
  }, [data]);

  // Gráfica de barras
  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = data.map((d) => d.name);
    const values = data.map((d) => d.value);

    const colors = [
      "#ec4899", // pink
      "#8b5cf6", // purple
      "#3b82f6", // blue
      "#10b981", // green
      "#f59e0b", // orange
      "#ef4444", // red
      "#06b6d4", // cyan
      "#6366f1", // indigo
    ];

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Fallos",
            data: values,
            backgroundColor: values.map((_, i) => colors[i % colors.length]),
            borderColor: values.map((_, i) => colors[i % colors.length]),
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 35,
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
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
            callbacks: {
              label: function (context) {
                return `Fallos: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              color: "#6b7280",
              font: { size: 11, weight: "600" },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#4b5563",
              font: { size: 11, weight: "600" },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  if (loading)
    return (
      <div className="text-center py-4">
        <div
          className="spinner mx-auto mb-2"
          style={{ width: "30px", height: "30px", borderWidth: "3px" }}
        />
        <p className="text-muted small mb-0">Cargando debilidades...</p>
      </div>
    );

  if (data.length === 0)
    return (
      <div
        className="text-center py-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05))",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📊</div>
        <p className="text-muted mb-0">
          No hay datos de debilidades aún.
          <br />
          Realiza más ejercicios para obtener un análisis.
        </p>
      </div>
    );

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      {/* Gráfica de radar */}
      <div>
        <div
          className="d-flex align-items-center gap-2 mb-3"
          style={{
            paddingBottom: "0.75rem",
            borderBottom: "2px solid rgba(236, 72, 153, 0.2)",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>🎯</span>
          <h6 className="mb-0 fw-bold" style={{ color: "#ec4899" }}>
            Puntos Débiles
          </h6>
        </div>
        <div style={{ height: "280px" }}>
          <canvas ref={radarCanvasRef} />
        </div>
      </div>

      {/* Gráfica de barras */}
      <div>
        <div
          className="d-flex align-items-center gap-2 mb-3"
          style={{
            paddingBottom: "0.75rem",
            borderBottom: "2px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>📊</span>
          <h6 className="mb-0 fw-bold" style={{ color: "#8b5cf6" }}>
            Análisis Detallado
          </h6>
        </div>
        <div style={{ height: "280px" }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
