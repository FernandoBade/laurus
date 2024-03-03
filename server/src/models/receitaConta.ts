import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const receitaContaSchema = new mongoose.Schema({
    conta: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    receitaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    receitaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria', required: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    observacao: { type: String },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'version'
});

receitaContaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

receitaContaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroReceitaConta', { id: documento._id }));
});

receitaContaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarReceitaConta', { id: documento._id }));
});

receitaContaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirReceitaConta', { id: documento._id }));
});

const ReceitaConta = mongoose.model('ReceitaConta', receitaContaSchema, 'ReceitaConta');

export default ReceitaConta;
