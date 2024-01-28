import ReceitaCartaoCredito from '../models/receitaCartaoCredito';
import ReceitaCategoria from '../models/receitaCategoria';
import ReceitaSubcategoria from '../models/receitaSubcategoria';
import Tag from '../models/tag';
import CartaoCredito from '../models/cartaoCredito';
import dotenv from 'dotenv';
import { gerarNumeroAleatorio, gerarDataAleatoria, selecionarTagsAleatorias } from './commons';
import { conectar, desconectar } from './criarConexaoBanco';


dotenv.config();

const usuarioId = process.env.USER_ID;
const cartaoCreditoId = process.env.CREDIT_CARD_ID;

async function criarReceitasCartaoCreditoAleatorias(quantidade = 10) {
    await conectar();

    try {
        const categorias = await ReceitaCategoria.find({ usuario: usuarioId });
        const subcategorias = await ReceitaSubcategoria.find({ usuario: usuarioId });
        const tags = await Tag.find({ usuario: usuarioId });

        for (let i = 0; i < quantidade; i++) {
            const categoriaEscolhida = categorias[Math.floor(Math.random() * categorias.length)];
            const subcategoriaEscolhida = subcategorias.filter(sc => sc.categoria.equals(categoriaEscolhida._id))[Math.floor(Math.random() * subcategorias.length)];

            const novaReceitaCartaoCredito = new ReceitaCartaoCredito({
                cartaoCredito: cartaoCreditoId,
                valor: gerarNumeroAleatorio(50, 1000),
                dataTransacao: gerarDataAleatoria(180, -1),
                receitaCategoria: categoriaEscolhida._id,
                receitaSubcategoria: subcategoriaEscolhida ? subcategoriaEscolhida._id : undefined,
                tags: selecionarTagsAleatorias(tags, 3).map(tag => tag._id),
                observacao: `Receita de cartão aleatória ${i + 1}`,
            });

            await novaReceitaCartaoCredito.save();

            await CartaoCredito.findByIdAndUpdate(novaReceitaCartaoCredito.cartaoCredito, {
                $push: { receitasCartaoCredito: novaReceitaCartaoCredito._id }
            });

            console.log(`Receita de cartão ${i + 1} criada com sucesso.`);
        }
    } catch (error) {
        console.error('Erro ao criar receitas de cartão de crédito aleatórias:', error);
    } finally {
        await desconectar();
    }
}

criarReceitasCartaoCreditoAleatorias().catch(console.error);
