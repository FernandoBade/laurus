import mongoose from 'mongoose';

const contaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    banco: { type: String, required: true },
    tipoConta: { type: String, enum: ['Corrente', 'Salário', 'Poupança', 'Investimento'], required: true },
    observacao: { type: String },
    despesasConta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaConta' }],
    receitasConta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaConta' }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Conta = mongoose.model('Conta', contaSchema, 'Conta');

export default Conta;
