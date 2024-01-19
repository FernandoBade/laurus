import express from 'express';
import despesaContaRoutes from './routes/despesaContaRoutes';
import despesaCartaoRoutes from './routes/despesaCartaoRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import mongoose from 'mongoose';
import cartaoCreditoRoutes from './routes/cartaoCreditoRoutes';
import contaRoutes from './routes/contaRoutes';

require('dotenv').config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A variável de ambiente URI não está definida.');
}

mongoose.connect(uri);

const app = express();

app.use(express.json());

app.use('/api/despesaConta', despesaContaRoutes);
app.use('/api/despesaCartao', despesaCartaoRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/conta', contaRoutes);
app.use('/api/cartaoCredito', cartaoCreditoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
