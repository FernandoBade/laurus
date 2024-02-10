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
  idioma: { type: String, required: true, enum: EnumIdiomas, default: EnumIdiomas.PT_BR },
  moeda: { type: String, required: true, enum: EnumMoedas, default: EnumMoedas.BRL },
  formatoData: { type: String, required: true, enum: EnumFormatoData, default: EnumFormatoData.DD_MM_YYYY }

});

usuarioSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
  next();
});

usuarioSchema.methods.verificarSenha = function(senhaNova: string | Buffer) {
  return bcrypt.compare(senhaNova, this.senha);
};

export default mongoose.model('Usuario', usuarioSchema, 'Usuario');
