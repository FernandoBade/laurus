import DespesaCartaoCredito from '../models/despesaCartaoCredito';
import DespesaCategoria from '../models/despesaCategoria';
import DespesaSubcategoria from '../models/despesaSubcategoria';
import Tag from '../models/tag';
import dotenv from 'dotenv';
import { conectar, desconectar } from './criarConexaoBanco';
import { gerarNumeroAleatorio, gerarDataAleatoria, selecionarTagsAleatorias } from './commons';
import CartaoCredito from '../models/cartaoCredito';

dotenv.config();

const usuarioId = process.env.USER_ID;
const cartaoCreditoId = process.env.CREDIT_CARD_ID;

async function criarDespesasCartaoCreditoAleatorias(quantidade = 100) {
    await conectar();

    try {
        const categorias = await DespesaCategoria.find({ usuario: usuarioId });
        const subcategorias = await DespesaSubcategoria.find({ usuario: usuarioId });
        const tags = await Tag.find({ usuario: usuarioId });

        for (let i = 0; i < quantidade; i++) {
            const valor = gerarNumeroAleatorio(50, 1000);
            let parcelamento = false;
            let numeroParcelaAtual = undefined;
            let totalParcelas = undefined;

            if (valor > 300) {
                parcelamento = Math.random() < 0.5;
                if (parcelamento) {
                    totalParcelas = gerarNumeroAleatorio(2, 12);
                    numeroParcelaAtual = gerarNumeroAleatorio(1, totalParcelas);
                }
            }

            const categoriaEscolhida = categorias[Math.floor(Math.random() * categorias.length)];
            const subcategoriaEscolhida = subcategorias.filter(sc => sc.categoria.equals(categoriaEscolhida._id))[Math.floor(Math.random() * subcategorias.length)];

            const novaDespesaCartaoCredito = new DespesaCartaoCredito({
                cartaoCredito: cartaoCreditoId,
                valor,
                dataTransacao: gerarDataAleatoria(180, -1),
                despesaCategoria: categoriaEscolhida._id,
                despesaSubcategoria: subcategoriaEscolhida ? subcategoriaEscolhida._id : undefined,
                tags: selecionarTagsAleatorias(tags, 3).map(tag => tag._id),
                parcelamento,
                numeroParcelaAtual,
                totalParcelas,
                observacao: `Despesa de cartão aleatória ${i + 1}`,
            });

            await novaDespesaCartaoCredito.save();

            await CartaoCredito.findByIdAndUpdate(novaDespesaCartaoCredito.cartaoCredito, {
                $push: { despesasCartaoCredito: novaDespesaCartaoCredito._id }
            });

            console.log(`Despesa de cartão ${i + 1} criada com sucesso.`);
        }
    } catch (error) {
        console.error('Erro ao criar despesas de cartão de crédito aleatórias:', error);
    } finally {
        await desconectar();
    }
}

criarDespesasCartaoCreditoAleatorias().catch(console.error);
