import mongoose from 'mongoose';

const receitaContaSchema = new mongoose.Schema({
    conta: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    receitaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    receitaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria', required: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    observacao: { type: String }
});

const ReceitaConta = mongoose.model('ReceitaConta', receitaContaSchema, 'ReceitaConta');

export default ReceitaConta;
