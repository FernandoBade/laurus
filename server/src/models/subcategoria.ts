import mongoose from 'mongoose';

const subcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Subcategoria = mongoose.model('Subcategoria', subcategoriaSchema);

export default Subcategoria;
