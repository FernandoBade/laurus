import mongoose from 'mongoose';

const despesaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

despesaSubcategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

const DespesaSubcategoria = mongoose.model('DespesaSubcategoria', despesaSubcategoriaSchema, 'DespesaSubcategoria');

export default DespesaSubcategoria;
