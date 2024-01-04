import mongoose from 'mongoose';

const despesaTipoTransacaoSchema = new mongoose.Schema({
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

const TipoTransacao = mongoose.model('DespesaTipoTransacao', despesaTipoTransacaoSchema, 'despesa_tipoTransacao');

export default TipoTransacao;
