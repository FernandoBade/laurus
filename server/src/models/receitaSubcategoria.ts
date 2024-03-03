import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const receitaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

receitaSubcategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

receitaSubcategoriaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroReceitaSubcategoria', { id: documento._id }));
});

receitaSubcategoriaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarReceitaSubcategoria', { id: documento._id }));
});

receitaSubcategoriaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirReceitaSubcategoria', { id: documento._id }));
});

const ReceitaSubcategoria = mongoose.model('ReceitaSubcategoria', receitaSubcategoriaSchema, 'ReceitaSubcategoria');

export default ReceitaSubcategoria;
