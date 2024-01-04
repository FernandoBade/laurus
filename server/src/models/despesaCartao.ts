import mongoose from 'mongoose';

const despesaCartaoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    subcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' },
    tipoTransacao: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoTransacao', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    parcelamento: { type: Boolean },
    observacao: { type: String }
});

const DespesaCartao = mongoose.model('DespesaCartao', despesaCartaoSchema, 'despesas_de_cartao');

export default DespesaCartao;
