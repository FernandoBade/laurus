import mongoose from 'mongoose';

const contaSchema = new mongoose.Schema({
    nome: {
        type: String,
        enum: ['Bradesco', 'Carteira', 'Nubank PF', 'Nubank PJ'],
        required: true
    }
});

const categoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        enum: [
            'Alimentação', 'Assinatura', 'Casa', 'Contas de Consumo', 'Documentação',
            'Eletrônico', 'Entretenimento', 'Imposto', 'Investimento', 'Papelaria',
            'Pet', 'Presente', 'Saúde', 'Tabacaria', 'Transporte', 'Vestuário'
        ],
        required: true
    }
});

const subcategoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        enum: [
            'Bebidas', 'Ifood', 'Lanches', 'Mercado', 'Porcaria', 'Refeições', 'Restaurantes'
        ],
        required: false
    }
});

const despesaSchema = new mongoose.Schema({
    categoria: categoriaSchema,
    conta: contaSchema,
    dataTransacao: { type: Date, required: true },
    observacao: String,
    subcategoria: subcategoriaSchema,
    tags: [String],
    tipoTransacao: {
        type: String,
        enum: ['Boleto', 'Débito', 'Outra', 'PIX', 'Saque', 'Transferência'],
        required: true
    },
    valor: { type: Number, required: true }
});

const Despesa = mongoose.model('Despesa', despesaSchema);

export default Despesa;
