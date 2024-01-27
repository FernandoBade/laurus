import DespesaCategoria from "../models/despesaCategoria";
import DespesaSubcategoria from "../models/despesaSubcategoria";
import dotenv from 'dotenv';

async function criarCategoriasESubcategorias() {
    const categoriasNomes = ['Alimentação', 'Entretenimento', 'Transporte', 'Vestuário'] as const;
    const subcategorias = {
        'Alimentação': ['Restaurante', 'Supermercado'],
        'Entretenimento': ['Cinema', 'Shows'],
        'Transporte': ['Uber', 'Ônibus'],
        'Vestuário': ['Roupas', 'Calçados']
    };

    const usuarioId = 'seuUsuarioIdAqui';

    for (const categoriaNome of categoriasNomes) {
        const novaCategoria = new DespesaCategoria({ nome: categoriaNome, usuario: usuarioId });
        await novaCategoria.save();

        const subcategoriaNomes = subcategorias[categoriaNome as keyof typeof subcategorias];

        for (const subcategoriaNome of subcategoriaNomes) {
            const novaSubcategoria = new DespesaSubcategoria({
                nome: subcategoriaNome,
                categoria: novaCategoria._id,
                usuario: usuarioId
            });
            await novaSubcategoria.save();
        }
    }

    console.log('Categorias e subcategorias criadas com sucesso.');
}

