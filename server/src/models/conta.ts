import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

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
    timestamps: true,
    versionKey: 'versao'
});

contaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroConta', { id: documento._id }));
});

contaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarConta', { id: documento._id }));
});

contaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirConta', { id: documento._id }));
});

const Conta = mongoose.model('Conta', contaSchema, 'Conta');

export default Conta;
