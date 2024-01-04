import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/usuario';
import Conta from '../models/conta';
import CartaoCredito from '../models/cartaoCredito';
import DespesaCategoria from '../models/despesaCategoria';
import DespesaSubcategoria from '../models/despesaSubcategoria';
import Tag from '../models/tag';
import DespesaTipoTransacao from '../models/despesaTipoTransacao';
import DespesaConta from '../models/despesaConta';
import DespesaCartao from '../models/despesaCartao';

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
    const contasNomes = ['PF', 'PJ'];
    const contasBancos = ['Nubank', 'Bradesco', 'C6 Bank'];
    const tagsNomes = ['viagem', 'trabalho'];
    const usuarioId = '65962ede933c35e1079900c3'

    const categorias = await Promise.all(categoriasNomes.map(nome => new DespesaCategoria({ nome, usuario: usuarioId }).save()));
    const contas = await Promise.all(contasNomes.flatMap(nome => contasBancos.map(banco => new Conta({ nome: `Conta ${nome} - ${banco}`, banco: banco, tipoConta: 'Conta Corrente', usuario: usuarioId }).save())));
    const tiposTransacao = await Promise.all(tiposTransacaoNomes.map(nome => new DespesaTipoTransacao({ nome }).save()));
    const tags = await Promise.all(tagsNomes.map(nome => new Tag({ nome, usuario: usuarioId }).save()));

    for (let i = 0; i < 300; i++) {
        const diasAleatorios = Math.floor(Math.random() * 180);
        const dataAleatoria = new Date();
        dataAleatoria.setDate(dataAleatoria.getDate() - diasAleatorios);

        const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
        const contaAleatoria = contas[Math.floor(Math.random() * contas.length)];
        const tipoTransacaoAleatorio = tiposTransacao[Math.floor(Math.random() * tiposTransacao.length)];
        const tagAleatoria = tags[Math.floor(Math.random() * tags.length)];

        const novaDespesa = new DespesaConta({
            despesaCategoria: categoriaAleatoria._id,
            conta: contaAleatoria._id,
            despesaTipoTransacao: tipoTransacaoAleatorio._id,
            tags: [tagAleatoria._id],
            dataTransacao: dataAleatoria,
            valor: parseFloat((Math.random() * 200).toFixed(2)),
            observacao: `Despesa inicial ${i + 1}`,
            usuario: usuarioId
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
