import mongoose from 'mongoose';

const despesaCartaoCreditoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    despesaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria', required: true },
    despesaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false }],
    parcelamento: { type: Boolean, default: false, required: false },
    numeroParcelaAtual: { type: Number, required: false },
    totalParcelas: { type: Number, required: false },
    observacao: { type: String, required: false },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});
const DespesaCartaoCredito = mongoose.model('DespesaCartaoCredito', despesaCartaoCreditoSchema, 'DespesaCartaoCredito');

export default DespesaCartaoCredito;
