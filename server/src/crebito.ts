/* eslint-disable @typescript-eslint/no-var-requires */
// src/app.ts

import express from 'express';
import despesaRoutes from './routes/despesaRoutes';
import mongoose from 'mongoose';
require('dotenv').config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A variável de ambiente URI não está definida.');
}

mongoose.connect(uri);


const app = express();

app.use(express.json());

// Rotas
app.use('/api/despesas', despesaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
