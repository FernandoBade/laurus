import mongoose from 'mongoose';

const receitaCartaoCreditoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    receitaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    receitaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria' },
    receitaTipoTransacao: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaTipoTransacao', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false }],
    observacao: { type: String, required: false },
});

const ReceitaCartao = mongoose.model('ReceitaCartaoCredito', receitaCartaoCreditoSchema, 'receita_cartaoCredito');

export default ReceitaCartao;
