import DespesaConta from '../models/despesaConta';
import DespesaCategoria from '../models/despesaCategoria';
import DespesaSubcategoria from '../models/despesaSubcategoria';
import Tag from '../models/tag';
import dotenv from 'dotenv';
import Conta from '../models/conta';
import { gerarNumeroAleatorio, gerarDataAleatoria, selecionarTagsAleatorias } from './commons';
import { conectar, desconectar } from './criarConexaoBanco';

dotenv.config();

const usuarioId = process.env.USER_ID;
const contaId = process.env.ACCOUNT_ID;

async function criarDespesasAleatorias(quantidade = 100) {
    await conectar();

    try {
        const categorias = await DespesaCategoria.find({ usuario: usuarioId });
        const subcategorias = await DespesaSubcategoria.find({ usuario: usuarioId });
        const tags = await Tag.find({ usuario: usuarioId });

        for (let i = 0; i < quantidade; i++) {
            const categoriaEscolhida = categorias[Math.floor(Math.random() * categorias.length)];
            const subcategoriaEscolhida = subcategorias.filter(sc => sc.categoria.equals(categoriaEscolhida._id))[Math.floor(Math.random() * subcategorias.length)];

            const novaDespesaConta = new DespesaConta({
                conta: contaId,
                valor: gerarNumeroAleatorio(50, 500),
                dataTransacao: gerarDataAleatoria(180, -1),
                despesaCategoria: categoriaEscolhida._id,
                despesaSubcategoria: subcategoriaEscolhida ? subcategoriaEscolhida._id : undefined,
                tags: selecionarTagsAleatorias(tags, 3).map(tag => tag._id),
                observacao: `Despesa aleatória ${i + 1}`,
            });

            await novaDespesaConta.save();

            await Conta.findByIdAndUpdate(novaDespesaConta.conta, {
                $push: { despesasConta: novaDespesaConta._id }
            });

            console.log(`Despesa ${i + 1} criada com sucesso.`);
        }
    } catch (error) {
        console.error('Erro ao criar despesas aleatórias:', error);
    } finally {
        await desconectar();
    }
}

criarDespesasAleatorias().catch(console.error);
