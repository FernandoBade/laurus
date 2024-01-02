import { DespesaConta } from '../models/despesa';
import mongoose from 'mongoose';
require('dotenv').config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A variável de ambiente URI não está definida.');
}

mongoose.connect(uri);

async function resetarBancoDeDados() {
    try {
        await DespesaConta.deleteMany({});
        console.log('Todas as despesas foram deletadas com sucesso.');
    } catch (error) {
        console.error('Erro ao deletar despesas:', error);
    } finally {
        mongoose.disconnect(); 
    }
}

resetarBancoDeDados();
