import mongoose from 'mongoose';

const despesaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Subcategoria = mongoose.model('DespesaSubcategoria', despesaSubcategoriaSchema, 'despesa_subcategoria');

export default Subcategoria;
