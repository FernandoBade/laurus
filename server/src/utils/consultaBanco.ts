import mongoose from 'mongoose';
import DespesaConta from '../models/despesaConta';
require('dotenv').config();

const uri = process.env.URI;
if (!uri) {
    throw new Error('A variável de ambiente URI não está definida.');
}

mongoose.connect(uri);

const contarTiposDeTransacao = async () => {
    try {
        const resultado = await DespesaConta.aggregate([
            { $group: { _id: "$despesaTipoTransacao", count: { $sum: 1 } } }
        ]);

        console.log("Contagem de tipos de transação:");
        for (let item of resultado) {
            console.log(`Tipo de Transação ID: ${item._id}, Quantidade: ${item.count}`);
        }
    } catch (error) {
        console.error("Erro ao contar tipos de transação:", error);
    } finally {
        await mongoose.disconnect();
    }
};

contarTiposDeTransacao();
