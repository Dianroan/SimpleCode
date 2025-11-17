// Trim seguro para strings (evita undefined/null)
export const s = (v) => (typeof v === "string" ? v.trim() : "");

// Reglas base
export const isEmail = (v) => /\S+@\S+\.\S+/.test(s(v));
export const isUsername = (v) => /^[a-zA-Z0-9._-]{3,}$/.test(s(v));
export const minLen = (v, n) => s(v).length >= n;

// Helpers de mensajes (opcional)
export const requiredMsg = (name = "Field") => `${name} is required.`;
export const minLenMsg = (name, n) =>
  `${name} debe tener al menos ${n} caracteres.`;
export const usernameMsg = "Usa al menos 3 caracteres: letras, números, . _ -";
export const emailMsg = "Email invalido";
export const passwordMismatchMsg = "Las contraseñas no coinciden.";
