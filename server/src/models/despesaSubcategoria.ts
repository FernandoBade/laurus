import mongoose from 'mongoose';
import logger, { resource } from '../utils/commons';

const despesaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: 'versao'
});

despesaSubcategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

despesaSubcategoriaSchema.post('save', function (documento) {
    logger.info(resource('log_sucessoCadastroDespesaSubcategoria', { id: documento._id }));
});

despesaSubcategoriaSchema.post('findOneAndUpdate', function (documento) {
    logger.notice(resource('log_sucessoAtualizarDespesaSubcategoria', { id: documento._id }));
});

despesaSubcategoriaSchema.post('findOneAndDelete', function (documento) {
    logger.warning(resource('log_sucessoExcluirDespesaSubcategoria', { id: documento._id }));
});

const DespesaSubcategoria = mongoose.model('DespesaSubcategoria', despesaSubcategoriaSchema, 'DespesaSubcategoria');

export default DespesaSubcategoria;
