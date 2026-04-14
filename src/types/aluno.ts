import { Turma } from "./turma";

export interface Aluno {
    id: string;
    nome: string;
    email: string;
    matricula: string;
    role: 'ALUNO';
    fotoUrl: string | null;
    turmas: Turma;
}

export interface AlunoRequest {
    nome: string;
    email: string;
    senha: string;
    matricula: string;
    turmaId: string;
}

export interface AtualizarPerfilAlunoRequest {
    nome?: string;
    senha?: string;
    fotoUrl?: string;
}