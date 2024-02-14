import mongoose from 'mongoose';

const despesaContaSchema = new mongoose.Schema({
    conta: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    despesaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria', required: true },
    despesaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria', required: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    observacao: { type: String },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});

const DespesaConta = mongoose.model('DespesaConta', despesaContaSchema, 'DespesaConta');

export default DespesaConta;
