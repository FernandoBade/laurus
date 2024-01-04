import mongoose from 'mongoose';

const despesaCategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    despesaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' }]
});

const Categoria = mongoose.model('DespesaCategoria', despesaCategoriaSchema, 'despesa_Categoria');

export default Categoria;
