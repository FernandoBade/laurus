import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CartaoCredito from '../models/cartaoCredito';
import DespesaCategoria from '../models/despesaCategoria';
import Tag from '../models/tag';
import DespesaTipoTransacao from '../models/despesaTipoTransacao';
import DespesaCartao from '../models/despesaCartao';
import { selecionarTagsAleatorias, gerarNumeroAleatorio } from './commons';

dotenv.config();
const uri = process.env.URI;
if (!uri) {
    throw new Error('A URI do banco de dados não está definida no arquivo .env');
}
mongoose.connect(uri);

async function criarMassaDeDados() {
    const tiposTransacaoNomes = ['Compra no Crédito', 'Pagamento', 'Outro', 'Multa/Juros'];
    const categoriasNomes = ['Alimentação', 'Assinatura', 'Casa', 'Eletrônico', 'Entretenimento', 'Papelaria', 'Pet', 'Presente', 'Saúde', 'Tabacaria', 'Transporte', 'Vestuário'];
    const cartoesNomesEBandeiras = [
        { nome: 'American Express', bandeira: 'Visa', diaFechamentoFatura: 1, diaVencimentoFatura: 10 },
        { nome: 'Bradesco Neo Platinum', bandeira: 'Visa', diaFechamentoFatura: 8, diaVencimentoFatura: 15 },
        { nome: 'Nubank Ultravioleta', bandeira: 'Mastercard', diaFechamentoFatura: 23, diaVencimentoFatura: 30 },
    ];
    const tagsNomes = ['viagem', 'trabalho', 'roles'];
    const usuarioId = '65a200a55310c32a39713c45'

    const cartoes = await Promise.all(cartoesNomesEBandeiras.map(cartao => new CartaoCredito({
        nome: cartao.nome,
        bandeira: cartao.bandeira,
        diaFechamentoFatura: cartao.diaFechamentoFatura,
        diaVencimentoFatura: cartao.diaVencimentoFatura,
        usuario: usuarioId
    }).save()));


    const categorias = await Promise.all(categoriasNomes.map(nome => new DespesaCategoria({ nome, usuario: usuarioId }).save()));
    const tiposTransacao = await Promise.all(tiposTransacaoNomes.map(nome => new DespesaTipoTransacao({ nome }).save()));
    const tags = await Promise.all(tagsNomes.map(nome => new Tag({ nome, usuario: usuarioId }).save()));

    for (let i = 0; i < 100; i++) {
        const diasAleatorios = Math.floor(Math.random() * 180);
        const dataAleatoria = new Date();
        dataAleatoria.setDate(dataAleatoria.getDate() - diasAleatorios);

        const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
        const cartaoAleatorio = cartoes[Math.floor(Math.random() * cartoes.length)];
        const tipoTransacaoAleatorio = tiposTransacao[Math.floor(Math.random() * tiposTransacao.length)];
        const tagsAleatorias = selecionarTagsAleatorias(tags, 3);

        const valor = parseFloat((Math.random() * 1000).toFixed(2));
        let parcelamento = false;
        let numeroParcelaAtual = undefined;
        let totalParcelas = undefined;

        if (valor > 300) {
            parcelamento = Math.random() < 0.5;
            if (parcelamento) {
                totalParcelas = gerarNumeroAleatorio(1, 12);
                numeroParcelaAtual = gerarNumeroAleatorio(1, totalParcelas);
            }
        }

        const novaDespesaCartao = new DespesaCartao({
            cartaoCredito: cartaoAleatorio._id,
            valor: valor,
            dataTransacao: dataAleatoria,
            despesaCategoria: categoriaAleatoria._id,
            despesaTipoTransacao: tipoTransacaoAleatorio._id,
            tags: tagsAleatorias,
            observacao: `Despesa inicial ${i + 1}`,
            parcelamento: parcelamento,
            numeroParcelaAtual: numeroParcelaAtual,
            totalParcelas: totalParcelas,
            usuario: usuarioId
        });

        console.log(`Criando Despesa de Cartão: ${i + 1}`);
        console.log(`- Categoria ID: ${categoriaAleatoria._id}`);
        console.log(`- Cartão ID: ${cartaoAleatorio._id}`);
        console.log(`- Tipo Transação ID: ${tipoTransacaoAleatorio._id}`);
        console.log(`- Tags ID: ${tagsAleatorias}`);
        console.log(`- Valor: R$ ${novaDespesaCartao.valor}`);
        console.log(`- Data Transação: ${novaDespesaCartao.dataTransacao}`);
        console.log(`- Observação: ${novaDespesaCartao.observacao}`);
        if (novaDespesaCartao.parcelamento) {
            console.log(`- Parcelamento: Sim`);
            console.log(`- Número Parcela Atual: ${novaDespesaCartao.numeroParcelaAtual}`);
            console.log(`- Total de Parcelas: ${novaDespesaCartao.totalParcelas}`);
        } else {
            console.log(`- Parcelamento: Não`);
        }
        console.log('--------------------------------------');

        await novaDespesaCartao.save();
    }

    console.log('100 transações de cartão de crédito criadas com sucesso.');
}

criarMassaDeDados()
    .catch(e => {
        console.error('Erro ao criar massa de dados:', e);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });