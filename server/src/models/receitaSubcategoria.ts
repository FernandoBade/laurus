import mongoose from 'mongoose';

const receitaSubcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});

receitaSubcategoriaSchema.index({ nome: 1, usuario: 1 }, { unique: true });

const ReceitaSubcategoria = mongoose.model('ReceitaSubcategoria', receitaSubcategoriaSchema, 'ReceitaSubcategoria');

export default ReceitaSubcategoria;
