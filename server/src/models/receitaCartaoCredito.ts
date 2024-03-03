import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const receitaCartaoCreditoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    receitaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    receitaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false }],
    observacao: { type: String, required: false },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

receitaCartaoCreditoSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroReceitaCartaoCredito', { id: documento._id }));
});

receitaCartaoCreditoSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarReceitaCartaoCredito', { id: documento._id }));
});

receitaCartaoCreditoSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirReceitaCartaoCredito', { id: documento._id }));
});

const ReceitaCartaoCredito = mongoose.model('ReceitaCartaoCredito', receitaCartaoCreditoSchema, 'ReceitaCartaoCredito');

export default ReceitaCartaoCredito;
