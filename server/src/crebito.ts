// src/app.ts

import express from 'express';
import despesaRoutes from './routes/despesaRoutes';
// importe outras rotas aqui

const app = express();

app.use(express.json());

// Rotas
app.use('/api/despesas', despesaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
