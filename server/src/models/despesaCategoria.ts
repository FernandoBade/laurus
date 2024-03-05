import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const despesaCategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    despesaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

despesaCategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

despesaCategoriaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroDespesaCategoria', { id: documento._id }));
});

despesaCategoriaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarDespesaCategoria', { id: documento._id }));
});

despesaCategoriaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirDespesaCategoria', { id: documento._id }));
});

const DespesaCategoria = mongoose.model('DespesaCategoria', despesaCategoriaSchema, 'DespesaCategoria');

export default DespesaCategoria;
