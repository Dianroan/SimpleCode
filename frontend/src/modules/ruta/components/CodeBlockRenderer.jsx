/**
 * Componente CodeBlockRenderer - Renderizador de bloques de código
 *
 * Procesa HTML con contenido mixto (texto + código):
 * - Detecta bloques <pre><code> y los reemplaza con AceEditor
 * - Calcula altura dinámica según número de líneas
 * - Renderiza el resto del HTML normalmente
 * - Usa useMemo para optimizar procesamiento
 *
 * @param {string} htmlContent - HTML con bloques pre/code a procesar
 */

import { useMemo } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-github";

/**
 * Calcula la altura dinámicamente basada en el contenido
 * @param {string} content - Contenido del código
 * @param {number} fontSize - Tamaño de fuente en píxeles
 * @returns {string} Altura en píxeles
 */
const calculateHeight = (content, fontSize = 14) => {
  const lines = content.split("\n").length;
  // Aproximadamente 20px por línea + padding
  const height = Math.max(lines * 20 + 10, 40);
  return `${height}px`;
};

/**
 * Componente que procesa HTML y reemplaza bloques <pre><code> con Ace Editor
 * @param {string} htmlContent - Contenido HTML con etiquetas pre/code
 */
export default function CodeBlockRenderer({ htmlContent }) {
  // Procesamos el HTML una sola vez con useMemo
  const processedContent = useMemo(() => {
    if (!htmlContent) return [];

    const result = [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    let elementId = 0;

    // Procesamos cada nodo del HTML
    tempDiv.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "PRE") {
        // Detectamos un bloque <pre><code>
        const codeElement = node.querySelector("code");
        if (codeElement) {
          const codeContent = codeElement.textContent;
          result.push({
            type: "code",
            id: elementId++,
            content: codeContent.trim(),
          });
          return;
        }
      }

      // Para otros elementos, guardamos el HTML
      if (node.nodeType === Node.ELEMENT_NODE) {
        result.push({
          type: "html",
          id: elementId++,
          html: node.outerHTML,
        });
      } else if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent.trim() !== ""
      ) {
        result.push({
          type: "text",
          id: elementId++,
          text: node.textContent,
        });
      }
    });

    return result;
  }, [htmlContent]);

  return (
    <div className="theory-content" style={{ marginBottom: 0 }}>
      {processedContent.map((block) => {
        if (block.type === "code") {
          const dynamicHeight = calculateHeight(block.content);
          return (
            <div
              key={block.id}
              className="code-block-editor"
              style={{
                border: "2px solid #e5e7eb",
                borderRadius: "1rem",
                overflow: "hidden",
                margin: "1.5rem 0",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#ff5f56",
                    }}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#ffbd2e",
                    }}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#27c93f",
                    }}
                  />
                </div>
                <span
                  style={{
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    marginLeft: "0.5rem",
                  }}
                >
                  C#
                </span>
              </div>
              <AceEditor
                mode="csharp"
                theme="github"
                name={`code-editor-${block.id}`}
                value={block.content}
                width="100%"
                height={dynamicHeight}
                readOnly={true}
                setOptions={{
                  useWorker: false,
                  fontSize: 14,
                  showLineNumbers: true,
                  maxLines: Infinity,
                }}
                editorProps={{ $blockScrolling: true }}
              />
            </div>
          );
        } else if (block.type === "html") {
          return (
            <div
              key={block.id}
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        } else if (block.type === "text") {
          return <span key={block.id}>{block.text}</span>;
        }

        return null;
      })}
    </div>
  );
}
