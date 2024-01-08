import mongoose from 'mongoose';

const despesaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const DespesaSubcategoria = mongoose.model('DespesaSubcategoria', despesaSubcategoriaSchema, 'DespesaSubcategoria');

export default DespesaSubcategoria;
