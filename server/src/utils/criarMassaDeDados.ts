import mongoose from 'mongoose';
import { DespesaConta, Categoria, Conta, TipoTransacao, Tag, Usuario } from '../models/despesa';

const uri = `mongodb+srv://crebito:WII8VNEuBYRrxRhv@crebito.anxiuwm.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri);

async function criarMassaDeDados() {
    // Criação do usuário
    // const novoUsuario = new Usuario({
    //     nomeCompleto: 'Fernando Bade',
    //     email: 'fernando@crebito.com',
    //     telefone: '11999999999',
    //     senha: 'senhaSegura',
    //     dataNascimento: new Date('1986-01-01')
    // });

    // await novoUsuario.save();

    const tiposTransacaoNomes = ['Boleto', 'Compra no Débito', 'Outra', 'PIX', 'Saque', 'Transferência'];
    const categoriasNomes = ['Alimentação', 'Assinatura', 'Casa', 'Contas de Consumo', 'Documentação', 'Eletrônico', 'Entretenimento', 'Imposto', 'Investimento', 'Papelaria', 'Pet', 'Presente', 'Saúde', 'Tabacaria', 'Transporte', 'Vestuário'];
    const contasNomes = ['PF', 'PJ'];
    const tagsNomes = ['viagem', 'trabalho'];
    const usuarioId = '6593636a883970c20f835e35'

    const categorias = await Promise.all(categoriasNomes.map(nome => new Categoria({ nome, usuario: usuarioId }).save()));
    const contas = await Promise.all(contasNomes.map(nome => new Conta({ nome, banco: 'Nubank', tipoConta: 'Conta Corrente', usuario: usuarioId }).save()));
    const tiposTransacao = await Promise.all(tiposTransacaoNomes.map(nome => new TipoTransacao({ nome }).save()));
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
            categoria: categoriaAleatoria._id,
            conta: contaAleatoria._id,
            tipoTransacao: tipoTransacaoAleatorio._id,
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
