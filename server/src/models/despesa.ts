import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { boolean } from 'joi';

//##################################################
//Usuário
const usuario = new mongoose.Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone: {
        type: String,
        required: false
    },
    senha: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    contas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conta'
    }],
    cartoesDeCredito: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartaoCredito'
    }],
    categorias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    }],
    subcategorias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategoria'
    }],
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
});

usuario.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 10);
    next();
});

usuario.methods.verificarSenha = function (senhaCandidata: string) {
    return bcrypt.compare(senhaCandidata, this.senha);
};

const Usuario = mongoose.model('Usuario', usuario);


//##################################################
//Conta
const contaSchema = new mongoose.Schema({
    banco: { type: String, required: true },
    tipoConta: { type: String, enum: ['Conta Corrente', 'Poupança', 'Investimento'], required: true },
    observacao: { type: String, required: false },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});
const Conta = mongoose.model('Conta', contaSchema);


//##################################################
//CartaoDeCredito
const cartoesDeCreditoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    bandeira: { type: String, required: true },
    diaFechamentoFatura: { type: Number, required: true },
    diaVencimentoFatura: { type: Number, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});
const CartaoCredito = mongoose.model('CartaoCredito', cartoesDeCreditoSchema, `cartoes_de_credito`);


//##################################################
//Categoria
const categoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    subcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' }]
});
const Categoria = mongoose.model('Categoria', categoriaSchema);


//##################################################
//Subcategoria
const subcategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});
const Subcategoria = mongoose.model('Subcategoria', subcategoriaSchema);


//##################################################
//Tag
const tagSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});
const Tag = mongoose.model('Tag', tagSchema);


//##################################################
//TipoTransacao
const tipoTransacaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        enum: ['Boleto', 'Compra no Crédito', 'Compra no Débito', 'Financiamento', 'Outra', 'Pagamento de Fatura', 'PIX', 'Saque', 'Transferência'],
        required: true
    }
});
const TipoTransacao = mongoose.model('TipoTransacao', tipoTransacaoSchema, 'tipos_de_transacoes');


//##################################################
//DespesaConta
const despesaContaSchema = new mongoose.Schema({
    conta: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    subcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' },
    tipoTransacao: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoTransacao', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    observacao: String
});
const DespesaConta = mongoose.model('Despesa', despesaContaSchema, 'despesas_de_contas');


//##################################################
//DespesaCartao
const despesaCartaoSchema = new mongoose.Schema({
    cartaoCredito: { type: mongoose.Schema.Types.ObjectId, ref: 'CartaoCredito', required: true },
    valor: { type: Number, required: true },
    dataTransacao: { type: Date, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    subcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' },
    tipoTransacao: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoTransacao', required: true },
    tags: [String],
    parcelamento: { type: Boolean, required: false },
    observacao: String
});
const DespesaCartao = mongoose.model('DespesaCartao', despesaCartaoSchema, 'despesas_de_cartao');


//##################################################
//Exportacoes
export {
    Usuario,
    Conta,
    CartaoCredito,
    Categoria,
    Subcategoria,
    TipoTransacao,
    DespesaConta,
    DespesaCartao,
    Tag
};
