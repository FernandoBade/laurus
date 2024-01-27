import Tag from "../models/tag";
import dotenv from 'dotenv';

dotenv.config();

import { conectar, desconectar } from './criarConexaoBanco';

dotenv.config();

async function criarTags() {
    const tagsNomes = ['hobbies', 'trampo', 'roles'];
    const usuarioId = process.env.USER_ID;

    await conectar();

    try {
        await Promise.all(tagsNomes.map(nome =>
            new Tag({
                nome,
                usuario: usuarioId
            }).save()
        ));

        console.log('Tags criadas com sucesso.');
    } catch (error) {
        console.error('Erro ao criar tags:', error);
        throw error;
    } finally {
        await desconectar();
    }
}

criarTags().catch(console.error);
