import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { getTopWeaknessesApi } from "@services/api/weaknesses";

export default function WeaknessCharts() {
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

  // Gráfica de barras
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

  if (loading) return <div>Cargando debilidades...</div>;

  if (data.length === 0)
    return (
      <div>
        No hay datos de debilidades aún. Realiza más ejercicios para obtener un
        análisis.
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Gráfica de radar */}
      <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <h6 style={{ marginBottom: "15px", textAlign: "center" }}>
          Puntos Débiles
        </h6>
        <canvas ref={radarCanvasRef} />
      </div>

      {/* Gráfica de barras */}
      <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <h6 style={{ marginBottom: "15px", textAlign: "center" }}>
          Análisis detallado de debilidades
        </h6>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
