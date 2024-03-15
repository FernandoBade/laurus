import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';
import { EnumTipoToken } from '../utils/assets/enums';

const tokenSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    valor: { type: String, required: true },
    tipo: { type: String, required: true, enum: EnumTipoToken },
    expiraEm: { type: Date, required: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

tokenSchema.post('save', function (documento, next) {
    documento.createdAt.getTime() === documento.updatedAt.getTime() ?
        logger.info(resource('log_sucessoCadastrarToken', { id: documento._id }))
        :
        logger.notice(resource('log_sucessoAtualizarToken', { id: documento._id }));
    next();
});

tokenSchema.post('findOneAndUpdate', function (documento, next) {
    logger.notice(resource('log_sucessoAtualizarToken', { id: documento._id }));
    next();
});

tokenSchema.post('findOneAndDelete', function (documento, next) {
    logger.warning(resource('log_sucessoExcluirToken', { id: documento._id }));
    next();
});

export default mongoose.model('Token', tokenSchema, 'Token');


