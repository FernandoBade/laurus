import mongoose from 'mongoose';

const despesaContaSchema = new mongoose.Schema({
    conta: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    subcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' },
    tipoTransacao: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoTransacao', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    observacao: { type: String }
});

const DespesaConta = mongoose.model('Despesa', despesaContaSchema, 'despesas_de_contas');

export default DespesaConta;
