import mongoose from 'mongoose';
import { conectar, desconectar } from './criarConexaoBanco';
import ReceitaCategoria from '../models/receitaCategoria';
import ReceitaSubcategoria from '../models/receitaSubcategoria';

async function criarReceitaCategoriasESubcategorias() {
    const categoriasNomes = ['Bônus', 'Freela'] as const;
    const subcategorias = {
        'Bônus': ['Metas', 'Revendas'],
        'Freela': ['Silv', 'Vinix']
    };

    const usuarioId = process.env.USER_ID;

    await conectar();

    try {
        for (const categoriaNome of categoriasNomes) {
            const novaCategoria = new ReceitaCategoria({ nome: categoriaNome, usuario: usuarioId });
            await novaCategoria.save();

            const subcategoriaNomes = subcategorias[categoriaNome as keyof typeof subcategorias];
            const subcategoriaIds = [];

            for (const subcategoriaNome of subcategoriaNomes) {
                const novaSubcategoria = new ReceitaSubcategoria({
                    nome: subcategoriaNome,
                    categoria: novaCategoria._id,
                    usuario: usuarioId
                });
                await novaSubcategoria.save();
                subcategoriaIds.push(novaSubcategoria._id);
            }

            await ReceitaCategoria.findByIdAndUpdate(novaCategoria._id, {
                $push: { receitaSubcategorias: { $each: subcategoriaIds } }
            });
        }

        console.log('Categorias e subcategorias criadas com sucesso.');
    } catch (error) {
        console.error('Erro ao criar categorias e subcategorias:', error);
    } finally {
        await desconectar();
    }
}

criarReceitaCategoriasESubcategorias().catch(console.error);
