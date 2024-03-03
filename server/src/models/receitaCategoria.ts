import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const receitaCategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    receitaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria' }],
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

receitaCategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

receitaCategoriaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroReceitaCategoria', { id: documento._id }));
});

receitaCategoriaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarReceitaCategoria', { id: documento._id }));
});

receitaCategoriaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirReceitaCategoria', { id: documento._id }));
});

const ReceitaCategoria = mongoose.model('ReceitaCategoria', receitaCategoriaSchema, 'ReceitaCategoria');

export default ReceitaCategoria;
