/**
 * Punto de entrada del servidor backend
 * 
 * Este archivo es el que inicia la aplicación Express.
 * Carga las variables de entorno, importa la configuración de Express
 * y pone el servidor a escuchar en el puerto configurado.
 */

import app from "./app.js";
import { env } from "./config/env.js";
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Iniciar el servidor HTTP en el puerto configurado (por defecto 4000)
app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
