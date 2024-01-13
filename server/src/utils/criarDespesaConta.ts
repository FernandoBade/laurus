import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Conta from '../models/conta';
import DespesaCategoria from '../models/despesaCategoria';
import Tag from '../models/tag';
import DespesaTipoTransacao from '../models/despesaTipoTransacao';
import DespesaConta from '../models/despesaConta';
import Usuario from '../models/usuario';
import { selecionarTagsAleatorias, gerarNumeroAleatorio } from './commons';

dotenv.config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A URI do banco de dados não está definida no arquivo .env');
}
mongoose.connect(uri);

async function criarMassaDeDados() {
    // const novoUsuario = new Usuario({
    //     nomeCompleto: 'Fernando Bade',
    //     email: 'fernando@laurus.com',
    //     telefone: '11999999999',
    //     senha: 'senhaSegura',
    //     dataNascimento: new Date('1986-01-01')
    // });

    // await novoUsuario.save();

    const tiposTransacaoNomes = ['Boleto', 'Compra no Débito', 'Outro', 'PIX', 'Saque', 'Transferência'];
    const categoriasNomes = ['Alimentação', 'Assinatura', 'Casa', 'Contas de Consumo', 'Documentação', 'Eletrônico', 'Entretenimento', 'Imposto', 'Investimento', 'Papelaria', 'Pet', 'Presente', 'Saúde', 'Tabacaria', 'Transporte', 'Vestuário'];
    const contasBancosETipos = [
        { nome: 'Principal', banco: "Nubank", tipoConta: 'Corrente' },
        { nome: 'Badixy', banco: "Nubank", tipoConta: 'Corrente' },
        { nome: 'Neogrid', banco: "Bradesco", tipoConta: 'Salário' },
        { nome: 'Investimentos', banco: "NuInvest", tipoConta: 'Investimento' },
    ];

    const tagsNomes = ['viagem', 'trabalho', 'empresa', 'roles']
    const usuarioId = '65a200a55310c32a39713c45'

    const contas = await Promise.all(contasBancosETipos.map(conta => new Conta({
        nome: conta.nome,
        banco: conta.banco,
        tipoConta: conta.tipoConta,
        usuario: usuarioId
    }).save()));

    const categorias = await Promise.all(categoriasNomes.map(nome => new DespesaCategoria({ nome, usuario: usuarioId }).save()));
    const tiposTransacao = await Promise.all(tiposTransacaoNomes.map(nome => new DespesaTipoTransacao({ nome }).save()));
    const tags = await Promise.all(tagsNomes.map(nome => new Tag({ nome, usuario: usuarioId }).save()));

    for (let i = 0; i < 150; i++) {
        const diasAleatorios = Math.floor(Math.random() * 180);
        const dataAleatoria = new Date();
        dataAleatoria.setDate(dataAleatoria.getDate() - diasAleatorios);

        const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
        const contaAleatoria = contas[Math.floor(Math.random() * contas.length)];
        const tipoTransacaoAleatorio = tiposTransacao[Math.floor(Math.random() * tiposTransacao.length)];
        const tagsAleatorias = selecionarTagsAleatorias(tags, 3);

        const novaDespesa = new DespesaConta({
            despesaCategoria: categoriaAleatoria._id,
            conta: contaAleatoria._id,
            despesaTipoTransacao: tipoTransacaoAleatorio._id,
            tags: tagsAleatorias,
            dataTransacao: dataAleatoria,
            valor: parseFloat((Math.random() * 200).toFixed(2)),
            observacao: `Despesa inicial ${i + 1}`,
            usuario: usuarioId
        });

        console.log(`Criando Despesa de Conta: ${i + 1}`);
        console.log(`- Categoria ID: ${categoriaAleatoria._id}`);
        console.log(`- Conta ID: ${contaAleatoria._id}`);
        console.log(`- Tipo Transação ID: ${tipoTransacaoAleatorio._id}`);
        console.log(`- Tags ID: [${tagsAleatorias}]`);
        console.log(`- Valor: R$ ${novaDespesa.valor}`);
        console.log(`- Data Transação: ${novaDespesa.dataTransacao}`);
        console.log(`- Observação: ${novaDespesa.observacao}`);
        console.log('--------------------------------------');

        await novaDespesa.save();
    }


    console.log('150 transações de conta criadas com sucesso.');
}

criarMassaDeDados()
    .catch(e => {
        console.error('Erro ao criar massa de dados:', e);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
