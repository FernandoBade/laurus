import mongoose from 'mongoose';
import { conectar, desconectar } from './criarConexaoBanco';
import DespesaCategoria from '../models/despesaCategoria';
import DespesaSubcategoria from '../models/despesaSubcategoria';

async function criarDespesaCategoriasESubcategorias() {
    const categoriasNomes = ['Saúde1', 'Entretenimento1', 'Rolê1', 'Vestuário1'] as const;
    const subcategorias = {
        'Saúde1': ['Vitamina1', 'Remédio1'],
        'Entretenimento1': ['Cinema1', 'Shows1'],
        'Rolê1': ['Boliche1', 'Fliperama1'],
        'Vestuário1': ['Roupas1', 'Calçados1']
    };

    const usuarioId = process.env.USER_ID;

    await conectar();

    try {
        for (const categoriaNome of categoriasNomes) {
            const novaCategoria = new DespesaCategoria({ nome: categoriaNome, usuario: usuarioId });
            await novaCategoria.save();

            const subcategoriaNomes = subcategorias[categoriaNome as keyof typeof subcategorias];
            const subcategoriaIds = [];

            for (const subcategoriaNome of subcategoriaNomes) {
                const novaSubcategoria = new DespesaSubcategoria({
                    nome: subcategoriaNome,
                    categoria: novaCategoria._id,
                    usuario: usuarioId
                });
                await novaSubcategoria.save();
                subcategoriaIds.push(novaSubcategoria._id);
            }

            await DespesaCategoria.findByIdAndUpdate(novaCategoria._id, {
                $push: { despesaSubcategorias: { $each: subcategoriaIds } }
            });
        }

        console.log('Categorias e subcategorias criadas com sucesso.');
    } catch (error) {
        console.error('Erro ao criar categorias e subcategorias:', error);
    } finally {
        await desconectar();
    }
}

criarDespesaCategoriasESubcategorias().catch(console.error);
