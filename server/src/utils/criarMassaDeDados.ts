import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function criarMassaDeDados() {
    for (let i = 0; i < 300; i++) {
        const diasAleatorios = Math.floor(Math.random() * 180);
        const dataAleatoria = new Date();
        dataAleatoria.setDate(dataAleatoria.getDate() - diasAleatorios);

        await prisma.despesa.create({
            data: {
                valor: parseFloat((Math.random() * 200).toFixed(2)),
                dataTransacao: dataAleatoria,
                tipoTransacaoId: Math.floor(Math.random() * 6) + 1,
                categoriaId: Math.floor(Math.random() * 17) + 1,
                contaId: Math.floor(Math.random() * 4) + 1,
                observacao: `Despesa inicial ${i + 1}`
            }
        });
    }

    console.log('300 transações criadas com sucesso.');
}

criarMassaDeDados()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
