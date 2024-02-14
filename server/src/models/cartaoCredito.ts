import mongoose from 'mongoose';

const cartaoCreditoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    bandeira: { type: String, required: true },
    diaFechamentoFatura: { type: Number, required: true },
    diaVencimentoFatura: { type: Number, required: true },
    despesasCartaoCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCartaoCredito' }],
    receitasCartaoCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCartaoCredito' }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});

const CartaoCredito = mongoose.model('CartaoCredito', cartaoCreditoSchema, 'CartaoCredito');

export default CartaoCredito;
