import mongoose from 'mongoose';

const contaSchema = new mongoose.Schema({
    banco: { type: String, required: true },
    tipoConta: { type: String, enum: ['Conta Corrente', 'Poupança', 'Investimento'], required: true },
    observacao: { type: String },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Conta = mongoose.model('Conta', contaSchema, 'conta');

export default Conta;
