import mongoose from 'mongoose';

const receitaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const ReceitaSubcategoria = mongoose.model('ReceitaSubcategoria', receitaSubcategoriaSchema, 'receita_subcategoria');

export default ReceitaSubcategoria;
