import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const cartaoCreditoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    bandeira: { type: String, required: true },
    diaFechamentoFatura: { type: Number, required: true },
    diaVencimentoFatura: { type: Number, required: true },
    despesasCartaoCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCartaoCredito' }],
    receitasCartaoCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCartaoCredito' }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

cartaoCreditoSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroCartaoCredito', { id: documento._id }));
});

cartaoCreditoSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarCartaoCredito', { id: documento._id }));
});

cartaoCreditoSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirCartaoCredito', { id: documento._id }));
});

const CartaoCredito = mongoose.model('CartaoCredito', cartaoCreditoSchema, 'CartaoCredito');

export default CartaoCredito;
