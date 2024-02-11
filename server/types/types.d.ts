// Dentro de types.d.ts
declare global {
    namespace Express {
        interface Request {
            usuarioId?: string;
        }
    }
}

export {};
