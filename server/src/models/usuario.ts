import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    nomeCompleto: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String },
    senha: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    contas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conta' }],
    cartoesDeCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito' }],
    despesaCategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria' }],
    despesaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaSubcategoria' }],
    receitaCategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria' }],
    receitaSubcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaSubcategoria' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 10);
    next();
});

usuarioSchema.methods.verificarSenha = function (senhaCandidata: string) {
    return bcrypt.compare(senhaCandidata, this.senha);
};

const Usuario = mongoose.model('Usuario', usuarioSchema, 'Usuario');

export default Usuario;
