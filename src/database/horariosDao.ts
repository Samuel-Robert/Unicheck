import { db } from "./db";
import { HorarioAula } from "@/types/horario";
import { buscarDisciplina } from "./disciplinasDao";

export function upsertHorario(h: HorarioAula): void {
    db.runSync(`INSERT OR REPLACE INTO horarios (id, diaSemana, horaInicio, horaFim, disciplinaId) VALUES (?, ?, ?, ?, ?)`, 
        [h.id, h.diaSemana, h.horaInicio, h.horaFim, h.disciplina.id]);
}

export function listarPorDisciplina(disciplinaId: string): HorarioAula[] {
    return db.getAllSync<any>(`SELECT * FROM horarios WHERE disciplinaId = ?`, [disciplinaId])
    .map(row => {
        const disciplina = buscarDisciplina(row.disciplinaId);
        if (!disciplina) return null;
        return {
            id: row.id,
            diaSemana: row.diaSemana,
            horaInicio: row.horaInicio,
            horaFim: row.horaFim,
            disciplina,
        }
    }).filter((h): h is HorarioAula => h !== null);
}

export function deletarHorario(id: string): void {
    db.runSync(`DELETE FROM horarios WHERE id = ?`, [id]);
}