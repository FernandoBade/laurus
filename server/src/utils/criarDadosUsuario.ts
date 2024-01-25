import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/usuario';

dotenv.config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A URI do banco de dados não está definida no arquivo .env');
}
mongoose.connect(uri);

async function criarMassaDeDados() {
    const novoUsuario = new Usuario({
        nomeCompleto: 'Fernando Bade',
        email: 'fernando@laurus.com',
        telefone: '11999999999',
        senha: 'senhaSegura',
        dataNascimento: new Date('1986-01-01')
    });

    await novoUsuario.save();
}

criarMassaDeDados()
    .catch(e => {
        console.error('Erro ao criar massa de dados:', e);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });