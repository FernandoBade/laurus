import mongoose from 'mongoose';

const contaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    banco: { type: String, required: true },
    tipoConta: { type: String, enum: ['Corrente', 'Salário', 'Poupança', 'Investimento'], required: true },
    observacao: { type: String },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Conta = mongoose.model('Conta', contaSchema, 'Conta');

export default Conta;
