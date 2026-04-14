import { Disciplina } from "./disciplina";

export interface DashboardDisciplina {
    disciplina: Disciplina;
    totalAlunos: number;
    totalPresencas: number;
    totalFaltas: number;
    PercentualPresenca: number;
}