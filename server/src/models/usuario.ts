import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { EnumMoedas, EnumFormatoData, EnumIdiomas } from '../utils/assets/enums';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sobrenome: { type: String, required: true },
    telefone: { type: String },
    senha: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    contas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conta' }],
    cartoesDeCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito' }],
    despesaCategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria' }],
    receitaCategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    idioma: { type: String, required: true, enum: Object.values(EnumIdiomas), default: EnumIdiomas.PT_BR },
    moeda: { type: String, required: true, enum: Object.values(EnumMoedas), default: EnumMoedas.BRL },
    formatoData: { type: String, required: true, enum: Object.values(EnumFormatoData), default: EnumFormatoData.DD_MM_YYYY }
});

usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 10);
    next();
});

usuarioSchema.methods.verificarSenha = function (senhaNova: string) {
    return bcrypt.compare(senhaNova, this.senha);
};

const Usuario = mongoose.model('Usuario', usuarioSchema, 'Usuario');

export default Usuario;
