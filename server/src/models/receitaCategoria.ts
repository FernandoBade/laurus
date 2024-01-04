import mongoose from 'mongoose';

const receitaCategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    receitaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria' }]
});

const Categoria = mongoose.model('ReceitaCategoria', receitaCategoriaSchema, 'receita_Categoria');

export default Categoria;
