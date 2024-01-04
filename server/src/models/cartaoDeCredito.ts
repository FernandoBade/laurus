import mongoose from 'mongoose';

const cartaoCreditoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    bandeira: { type: String, required: true },
    diaFechamentoFatura: { type: Number, required: true },
    diaVencimentoFatura: { type: Number, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const CartaoCredito = mongoose.model('CartaoCredito', cartaoCreditoSchema, 'cartoes_de_credito');

export default CartaoCredito;
