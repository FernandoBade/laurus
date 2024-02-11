import { Types } from 'mongoose';
import { EnumIdiomas, EnumFormatoData, EnumMoedas } from '../utils/assets/enums';

export interface IUsuario {
    [x: string]: any;
    nome: string;
    email: string;
    sobrenome: string;
    telefone?: string | null;
    senha: string;
    dataNascimento: Date;
    contas: Types.ObjectId[];
    cartoesDeCredito: Types.ObjectId[];
    despesaCategorias: Types.ObjectId[];
    receitaCategorias: Types.ObjectId[];
    tags: Types.ObjectId[];
    idioma: EnumIdiomas;
    moeda: EnumMoedas;
    formatoData: EnumFormatoData;
}
