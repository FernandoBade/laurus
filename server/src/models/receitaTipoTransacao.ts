import mongoose from 'mongoose';

const receitaTipoTransacaoSchema = new mongoose.Schema({
    nome: {
        type: String, enum: [
            'Crédito em Conta',
            'Depósito em Dinheiro',
            'Estorno',
            'Pagamento de Fatura',
            'PIX',
            'Reembolso',
            'Outro'
        ], required: true
    }
});

const TipoTransacao = mongoose.model('ReceitaTipoTransacao', receitaTipoTransacaoSchema, 'receita_tipoTransacao');

export default TipoTransacao;
