import { ZodError } from "zod";

export const validateSchema = (schema) => (req, res, next) => {
    try {
        console.log(req.body);
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            console.log("Errores Zod:", error.issues); 
            return res.status(400).json({
                error: error.issues.map(e => e.message)
            });
        }   
        console.log("Error inesperado:", error);
        return res.status(400).json({ error: [error.message] });
    }
};