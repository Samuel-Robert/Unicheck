import { Disciplina } from "./disciplina";

export interface Aula {
    id: string;
    titulo: string;
    dataHora: string;
    ativa: boolean;
    disciplina: Disciplina;
}

export interface IniciarAulaRequest {
    disciplinaId: string;
    titulo: string;
}