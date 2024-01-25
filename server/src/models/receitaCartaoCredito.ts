import mongoose from 'mongoose';

const receitaCartaoCreditoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    receitaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    receitaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false }],
    observacao: { type: String, required: false },
});

const ReceitaCartaoCredito = mongoose.model('ReceitaCartaoCredito', receitaCartaoCreditoSchema, 'ReceitaCartaoCredito');

export default ReceitaCartaoCredito;
