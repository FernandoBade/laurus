import express from 'express';
import mongoose from 'mongoose';
import despesaContaRoutes from './routes/despesaContaRoutes';
import despesaCartaoCreditoRoutes from './routes/despesaCartaoCreditoRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import cartaoCreditoRoutes from './routes/cartaoCreditoRoutes';
import contaRoutes from './routes/contaRoutes';
import authRoutes from './routes/authRoutes';
import despesaCategoriaRoutes from './routes/despesaCategoriaRoutes';
import despesaSubcategoriaRoutes from './routes/despesaSubcategoriaRoutes';
import tagRoutes from './routes/tagRoutes';
import receitaCategoriaRoutes from './routes/receitaCategoriaRoutes';
import receitaSubcategoriaRoutes from './routes/receitaSubcategoriaRoutes';
import receitaContaRoutes from './routes/receitaContaRoutes';
import receitaCartaoCreditoRoutes from './routes/receitaCartaoCreditoRoutes';

require('dotenv').config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A variável de ambiente URI não está definida.');
}

mongoose.connect(uri);

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/conta', contaRoutes);
app.use('/api/cartaoCredito', cartaoCreditoRoutes);
app.use('/api/despesaConta', despesaContaRoutes);
app.use('/api/despesaCartaoCredito', despesaCartaoCreditoRoutes);
app.use('/api/despesaCategoria', despesaCategoriaRoutes);
app.use('/api/despesaSubcategoria', despesaSubcategoriaRoutes);
app.use('/api/receitaConta', receitaContaRoutes);
app.use('/api/receitaCartaoCredito', receitaCartaoCreditoRoutes);
app.use('/api/receitaCategoria', receitaCategoriaRoutes);
app.use('/api/receitaSubcategoria', receitaSubcategoriaRoutes);
app.use('/api/tag', tagRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
