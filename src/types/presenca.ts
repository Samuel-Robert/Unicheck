import { Aluno } from "./aluno";
import { Aula } from "./aula";

export interface Presenca {
    id: string;
    aluno: Aluno;
    aula: Aula;
    sataHora: string;
}

export interface RegistrarPresencaRequest {
    qrCode: string
    aulaId: string;
}

export interface ConfirmacaoPresenca {
    nome: string;
    matricula: string;
    fotoUrl: string | null;
}

export interface SincronizacaoPresencaDTO {
    alunoId: string;
    aulaId: string;
    dataHoraLocal: string;
}