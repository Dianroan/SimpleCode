/**
 * Utilidades para validación de formularios
 * 
 * Proporciona funciones para validar campos y generar mensajes de error
 */

/**
 * Sanitiza strings (trim) y maneja null/undefined
 * @param {any} v - Valor a sanitizar
 * @returns {string} String sanitizado o cadena vacía
 */
export const s = (v) => (typeof v === "string" ? v.trim() : "");

/**
 * Valida formato de email
 */
export const isEmail = (v) => /\S+@\S+\.\S+/.test(s(v));

/**
 * Valida formato de username (3+ caracteres: letras, números, . _ -)
 */
export const isUsername = (v) => /^[a-zA-Z0-9._-]{3,}$/.test(s(v));

/**
 * Valida longitud mínima de un string
 */
export const minLen = (v, n) => s(v).length >= n;

// Mensajes de error
export const requiredMsg = (name = "Field") => `${name} is required.`;
export const minLenMsg = (name, n) => `${name} debe tener al menos ${n} caracteres.`;
export const usernameMsg = "Usa al menos 3 caracteres: letras, números, . _ -";
export const emailMsg = "Email invalido";
export const passwordMismatchMsg = "Las contraseñas no coinciden.";
