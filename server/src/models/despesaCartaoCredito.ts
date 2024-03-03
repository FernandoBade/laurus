import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const despesaCartaoCreditoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    despesaCategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria', required: true },
    despesaSubcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false }],
    parcelamento: { type: Boolean, default: false, required: false },
    numeroParcelaAtual: { type: Number, required: false },
    totalParcelas: { type: Number, required: false },
    observacao: { type: String, required: false },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

despesaCartaoCreditoSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroDespesaCartaoCredito', { id: documento._id }));
});

despesaCartaoCreditoSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarDespesaCartaoCredito', { id: documento._id }));
});

despesaCartaoCreditoSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirDespesaCartaoCredito', { id: documento._id }));
});

const DespesaCartaoCredito = mongoose.model('DespesaCartaoCredito', despesaCartaoCreditoSchema, 'DespesaCartaoCredito');

export default DespesaCartaoCredito;
