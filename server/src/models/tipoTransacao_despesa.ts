import mongoose from 'mongoose';

const tipoTransacaoSchema = new mongoose.Schema({
    nome: {
        type: String, enum: [
            'Boleto',
            'Compra no Crédito',
            'Compra no Débito',
            'Fatura de Cartão',
            'Empréstimo/Financiamento',
            'Multa/Juros',
            'Outro',
            'Pagamento',
            'PIX',
            'Saque',
            'Transferência'
        ], required: true
    }
});

const TipoTransacao = mongoose.model('TipoTransacao', tipoTransacaoSchema, 'tipos_de_transacoes');

export default TipoTransacao;
