import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

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
    timestamps: true,
    versionKey: 'versao'
});

despesaContaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroDespesaConta', { id: documento._id }));
});

despesaContaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarDespesaConta', { id: documento._id }));
});

despesaContaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirDespesaConta', { id: documento._id }));
});

const DespesaConta = mongoose.model('DespesaConta', despesaContaSchema, 'DespesaConta');

export default DespesaConta;
