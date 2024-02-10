import { Document } from 'mongoose';
import { EnumIdiomas, EnumFormatoData, EnumMoedas } from '../utils/assets/enums';

export interface IUsuario extends Document {
    nome: string;
    email: string;
    sobrenome: string;
    telefone?: string;
    senha: string;
    dataNascimento: Date;
    contas: string[];
    cartoesDeCredito: string[];
    despesaCategorias: string[];
    receitaCategorias: string[];
    tags: string[];
    idioma: EnumIdiomas;
    moeda: EnumMoedas;
    formatoData: EnumFormatoData;
}
