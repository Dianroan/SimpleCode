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
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
                margin: "12px 0",
              }}
            >
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
                  fontSize: 13,
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
