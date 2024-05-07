//#region imports
import authRoutes from './routes/authRoutes';
import express, { Request, Response, NextFunction } from 'express';
import cartaoCreditoRoutes from './routes/cartaoCreditoRoutes';
import contaRoutes from './routes/contaRoutes';
import despesaCartaoCreditoRoutes from './routes/despesaCartaoCreditoRoutes';
import despesaCategoriaRoutes from './routes/despesaCategoriaRoutes';
import despesaContaRoutes from './routes/despesaContaRoutes';
import despesaSubcategoriaRoutes from './routes/despesaSubcategoriaRoutes';
import mongoose from 'mongoose';
import receitaCartaoCreditoRoutes from './routes/receitaCartaoCreditoRoutes';
import receitaCategoriaRoutes from './routes/receitaCategoriaRoutes';
import receitaContaRoutes from './routes/receitaContaRoutes';
import receitaSubcategoriaRoutes from './routes/receitaSubcategoriaRoutes';
import tagRoutes from './routes/tagRoutes';
import tokenRoutes from './routes/tokenRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import { logger, resource, responderAPI } from './utils/commons';
import path from 'path';
//#endregion imports

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.URI;
if (!uri) {
    throw new Error(resource('erro.variavelAmbiente'));
}

mongoose.connect(uri);

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cartaoCredito', cartaoCreditoRoutes);
app.use('/api/conta', contaRoutes);
app.use('/api/despesaCartaoCredito', despesaCartaoCreditoRoutes);
app.use('/api/despesaCategoria', despesaCategoriaRoutes);
app.use('/api/despesaConta', despesaContaRoutes);
app.use('/api/despesaSubcategoria', despesaSubcategoriaRoutes);
app.use('/api/receitaCartaoCredito', receitaCartaoCreditoRoutes);
app.use('/api/receitaCategoria', receitaCategoriaRoutes);
app.use('/api/receitaConta', receitaContaRoutes);
app.use('/api/receitaSubcategoria', receitaSubcategoriaRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/usuario', usuarioRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.use((erro: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(resource("log_erroInternoServidor", { erro: erro.stack }));
    responderAPI(res, 500, "erro_internoServidor", { erro: erro.stack });
});

export default app;
