/**
 * Configuración centralizada de variables de entorno
 * 
 * Este módulo carga las variables de entorno del archivo .env
 * y las exporta en un objeto estructurado para uso en toda la aplicación.
 * 
 * Si una variable no está definida en .env, se usa un valor por defecto.
 */

import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

/**
 * Objeto de configuración exportado
 * Contiene toda la configuración del servidor y base de datos
 */
export const env = {
  // Puerto en el que escucha el servidor (por defecto: 4000)
  port: process.env.PORT || 4000,
  
  // Entorno de ejecución: development, production, test
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Secreto para firmar tokens JWT (CAMBIAR en producción)
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  
  // Configuración de conexión a MySQL
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "simplecode_db",
  },
};
