import mongoose from 'mongoose';

const despesaCategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    despesaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' }]
});

despesaCategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

const DespesaCategoria = mongoose.model('DespesaCategoria', despesaCategoriaSchema, 'DespesaCategoria');

export default DespesaCategoria;
