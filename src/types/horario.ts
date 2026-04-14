import { Disciplina } from "./disciplina";

export type DiaSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

export interface HorarioAula {
    id: string;
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFim: string;
    disciplina: Disciplina;
}

export interface HorarioRequest {
    disciplinaId: string;
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFim: string;
}