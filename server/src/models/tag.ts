import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const tagSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

tagSchema.index({ nome: 1, usuario: 1 }, { unique: true });

tagSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroTag', { id: documento._id }));
});

tagSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarTag', { id: documento._id }));
});

tagSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirTag', { id: documento._id }));
});

const Tag = mongoose.model('Tag', tagSchema, 'Tag');

export default Tag;
