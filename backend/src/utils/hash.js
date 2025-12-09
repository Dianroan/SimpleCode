/**
 * Utilidades para encriptación de contraseñas
 * 
 * Este módulo proporciona funciones para:
 * - Encriptar contraseñas en texto plano usando bcrypt
 * - Comparar contraseñas en texto plano con su hash
 * 
 * bcrypt es un algoritmo de hash diseñado específicamente para contraseñas,
 * que incluye un "salt" automático y es resistente a ataques de fuerza bruta.
 */

import bcrypt from "bcrypt";

// Número de rondas de salt para bcrypt (10 es un buen balance entre seguridad y rendimiento)
const ROUNDS = 10;

/**
 * Encripta una contraseña en texto plano
 * @param {string} plain - Contraseña en texto plano
 * @returns {Promise<string>} Hash bcrypt de la contraseña
 */
export const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);

/**
 * Compara una contraseña en texto plano con su hash
 * @param {string} plain - Contraseña en texto plano
 * @param {string} hash - Hash bcrypt almacenado en BD
 * @returns {Promise<boolean>} true si coinciden, false si no
 */
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);
