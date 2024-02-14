import mongoose from 'mongoose';

const despesaCategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    receitaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});

despesaCategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

const DespesaCategoria = mongoose.model('DespesaCategoria', despesaCategoriaSchema, 'DespesaCategoria');

export default DespesaCategoria;
