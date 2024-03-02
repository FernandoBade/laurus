// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const uri: string | any = process.env.URI;
// if (!uri) {
//     throw new Error('A variável de ambiente URI não está definida.');
// }

// async function conectar() {
//     try {
//         await mongoose.connect(uri);
//         console.log('Conexão com o MongoDB estabelecida com sucesso pelo Mongoose.');
//     } catch (error) {
//         console.error('Não foi possível conectar ao MongoDB pelo Mongoose:', error);
//         process.exit(1);
//     }
// }

// async function desconectar() {
//     try {
//         await mongoose.disconnect();
//         console.log('Conexão com o MongoDB encerrada com sucesso pelo Mongoose.');
//     } catch (error) {
//         console.error('Erro ao fechar a conexão com o MongoDB pelo Mongoose:', error);
//     }
// }

// export { conectar, desconectar };
