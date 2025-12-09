/**
 * Middleware de validación de datos con Zod
 * 
 * Este middleware valida los datos de entrada (body, params, query)
 * contra un schema definido con Zod antes de que lleguen al controller.
 * 
 * Uso en rutas:
 *   const schema = z.object({ body: z.object({ email: z.string().email() }) });
 *   router.post('/ruta', validate(schema), controller);
 */

import { ZodError } from "zod";

/**
 * Factory que crea un middleware de validación
 * 
 * Funcionamiento:
 * 1. Recibe un schema de Zod que define la estructura esperada
 * 2. Valida body, params y query de la petición contra el schema
 * 3. Si la validación pasa, añade los datos validados a req.validated
 * 4. Si falla, retorna error 400 con detalles de los errores
 * 
 * @param {ZodSchema} schema - Schema de Zod que define la validación
 * @returns {Function} Middleware de Express
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Intentar parsear y validar los datos de la petición
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    
    // Si la validación pasa, continuar
    next();
  } catch (err) {
    // Si hay un error de validación de Zod
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "ValidationError",
        details: err.errors, // Array con todos los errores encontrados
      });
    }
    
    // Si es otro tipo de error, pasarlo al siguiente error handler
    next(err);
  }
};
