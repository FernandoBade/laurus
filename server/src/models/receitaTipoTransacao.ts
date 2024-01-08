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

const ReceitaTipoTransacao = mongoose.model('ReceitaTipoTransacao', receitaTipoTransacaoSchema, 'ReceitaTipoTransacao');

export default ReceitaTipoTransacao;
