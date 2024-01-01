/* eslint-disable @typescript-eslint/no-var-requires */
import mongoose from 'mongoose';
import Despesa from '../models/despesa';
require('dotenv').config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A variável de ambiente MONGODB_URI não está definida.');
}

mongoose.connect(uri);

async function criarMassaDeDados() {
    const tiposTransacao = ['Boleto', 'Débito', 'Outra', 'PIX', 'Saque', 'Transferência'];
    const categorias = ['Alimentação', 'Assinatura', 'Casa', 'Contas de Consumo', 'Documentação', 'Eletrônico', 'Entretenimento', 'Imposto', 'Investimento', 'Papelaria', 'Pet', 'Presente', 'Saúde', 'Tabacaria', 'Transporte', 'Vestuário'];
    const contas = ['Carteira', 'Nubank PF', 'Nubank PJ', 'Bradesco'];

    for (let i = 0; i < 300; i++) {
        const diasAleatorios = Math.floor(Math.random() * 180);
        const dataAleatoria = new Date();
        dataAleatoria.setDate(dataAleatoria.getDate() - diasAleatorios);

        const novaDespesa = new Despesa({
            categoria: { nome: categorias[Math.floor(Math.random() * categorias.length)] },
            conta: { nome: contas[Math.floor(Math.random() * contas.length)] },
            dataTransacao: dataAleatoria,
            tipoTransacao: tiposTransacao[Math.floor(Math.random() * tiposTransacao.length)],
            valor: parseFloat((Math.random() * 200).toFixed(2)),
            observacao: `Despesa inicial ${i + 1}`
        });

        await novaDespesa.save();
    }

    console.log('300 transações criadas com sucesso.');
}

criarMassaDeDados()
    .catch(e => {
        console.error('Erro ao criar massa de dados:', e);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
