import { Turma } from "./turma";
import { Professor } from "./professor";

export interface Disciplina {
    id: string;
    nome: string;
    codigo: string | null;
    turma: Turma;
    professor: Professor;
}

export interface DisciplinaRequest {
    nome: string;
    turmaId: string;
    professorId: string;
}