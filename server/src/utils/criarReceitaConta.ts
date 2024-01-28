import ReceitaConta from '../models/receitaConta';
import ReceitaCategoria from '../models/receitaCategoria';
import ReceitaSubcategoria from '../models/receitaSubcategoria';
import Tag from '../models/tag';
import dotenv from 'dotenv';
import { conectar, desconectar } from './criarConexaoBanco';
import { gerarNumeroAleatorio, gerarDataAleatoria, selecionarTagsAleatorias } from './commons';
import Conta from '../models/conta';

dotenv.config();

const usuarioId = process.env.USER_ID;
const contaId = process.env.ACCOUNT_ID;

async function criarReceitasContaAleatorias(quantidade = 10) {
    await conectar();

    try {
        const categorias = await ReceitaCategoria.find({ usuario: usuarioId });
        const subcategorias = await ReceitaSubcategoria.find({ usuario: usuarioId });
        const tags = await Tag.find({ usuario: usuarioId });

        for (let i = 0; i < quantidade; i++) {
            const categoriaEscolhida = categorias[Math.floor(Math.random() * categorias.length)];
            const subcategoriaEscolhida = subcategorias.filter(sc => sc.categoria.equals(categoriaEscolhida._id))[Math.floor(Math.random() * subcategorias.length)];

            const novaReceitaConta = new ReceitaConta({
                conta: contaId,
                valor: gerarNumeroAleatorio(50, 500),
                dataTransacao: gerarDataAleatoria(180, -1),
                receitaCategoria: categoriaEscolhida._id,
                receitaSubcategoria: subcategoriaEscolhida ? subcategoriaEscolhida._id : undefined,
                tags: selecionarTagsAleatorias(tags, 3).map(tag => tag._id),
                observacao: `Receita aleatória ${i + 1}`,
            });

            await novaReceitaConta.save();

            await Conta.findByIdAndUpdate(novaReceitaConta.conta, {
                $push: { receitasConta: novaReceitaConta._id }
            });

            console.log(`Receita ${i + 1} criada com sucesso.`);
        }
    } catch (error) {
        console.error('Erro ao criar receitas de conta aleatórias:', error);
    } finally {
        await desconectar();
    }
}

criarReceitasContaAleatorias().catch(console.error);
