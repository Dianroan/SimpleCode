// Trim seguro para strings (evita undefined/null)
export const s = (v) => (typeof v === "string" ? v.trim() : "");

// Reglas base
export const isEmail = (v) => /\S+@\S+\.\S+/.test(s(v));
export const isUsername = (v) => /^[a-zA-Z0-9._-]{3,}$/.test(s(v));
export const minLen = (v, n) => s(v).length >= n;

// Helpers de mensajes (opcional)
export const requiredMsg = (name = "Field") => `${name} is required.`;
export const minLenMsg = (name, n) =>
  `${name} must be at least ${n} characters.`;
export const usernameMsg = "Use 3+ chars: letters, numbers, . _ -";
export const emailMsg = "Invalid email.";
export const passwordMismatchMsg = "Passwords do not match.";
