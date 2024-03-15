import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { EnumMoedas, EnumFormatoData, EnumIdiomas, EnumAparencias } from '../utils/assets/enums';
import logger, { resource } from '../utils/commons';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    sobrenome: { type: String, required: true },
    telefone: { type: String },
    senha: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    ativo: { type: Boolean, default: true },
    ultimoAcesso: { type: Date, default: Date.now() },
    aparencia: { type: String, enum: EnumAparencias, default: EnumAparencias.DARK_MODE, required: false },
    idioma: { type: String, required: true, enum: EnumIdiomas, default: EnumIdiomas.PT_BR },
    moeda: { type: String, required: true, enum: EnumMoedas, default: EnumMoedas.BRL },
    formatoData: { type: String, required: true, enum: EnumFormatoData, default: EnumFormatoData.DD_MM_YYYY },
    tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token', required: true }],
    contas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conta' }],
    cartoesDeCredito: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito' }],
    despesaCategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DespesaCategoria' }],
    receitaCategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReceitaCategoria' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
}, {
    timestamps: true,
    versionKey: 'versao'
});

usuarioSchema.pre('save', async function (next) {
    if (this.isModified('senha')) {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

usuarioSchema.methods.verificarSenha = function (senhaNova: string) {
    return bcrypt.compare(senhaNova, this.senha);
};

usuarioSchema.pre('save', async function (next) {
    (this as any)._wasNew = this.isNew;
    next();
});

usuarioSchema.post('save', function (documento, next) {
    documento.createdAt.getTime() === documento.updatedAt.getTime() ?
        logger.info(resource('log_sucessoCadastroUsuario', { id: documento._id }))
        :
        logger.notice(resource('log_sucessoAtualizarUsuario', { id: documento._id }));
    next();
});

usuarioSchema.post('findOneAndUpdate', function (documento, next) {
    logger.notice(resource('log_sucessoAtualizarUsuario', { id: documento._id }));
    next();
});

usuarioSchema.post('findOneAndDelete', function (documento, next) {
    logger.warning(resource('log_sucessoExcluirUsuario', { id: documento._id }));
    next();
});

export default mongoose.model('Usuario', usuarioSchema, 'Usuario');
