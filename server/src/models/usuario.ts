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
    categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }],
    subcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' }],
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

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
