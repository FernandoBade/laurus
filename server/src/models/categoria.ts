import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    subcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' }]
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
