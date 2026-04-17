import { db } from "./db";
import { Aula } from "@/types/aula";
import { buscarDisciplina } from "./disciplinasDao";

export function upsertAula (a: Aula): void {
    db.runSync(`INSERT OR REPLACE INTO aulas (id, titulo, dataHora, ativa, disciplinaId, sincronizado) VALUES (?, ?, ?, ?, ?, ?)`,
        [a.id, a.titulo, a.dataHora, a.ativa ? 1 : 0, a.disciplina.id]
    );
}

export function listarPorDisciplina(disciplinaId: string): Aula[] {
    return db.getAllSync<any>(`SELECT * FROM aulas WHERE disciplinaId = ? ORDER BY dataHora DESC`, [disciplinaId])
        .map(row => montarAula(row))
        .filter((a): a is Aula => a !== null);
}

export function buscarAulaAtiva(disciplinaId: string): Aula | null {
    const row = db.getFirstSync<any>(`SELECT * FROM aulas WHERE disciplinaId = ? AND ativa = 1`, [disciplinaId]);
    if (!row) return null;
    return montarAula(row);
}

export function buscarAula(id: string): Aula | null {
    const row = db.getFirstSync<any>(`SELECT * FROM aulas WHERE id = ?`, [id]);
    if (!row) return null;
    return montarAula(row);
}

export function encerrarAulaLocal(id: string): void {
    db.runSync(`UPDATE aulas SET ativa = 0 WHERE id = ?`, [id]);
}

function montarAula(row: any): Aula | null {
    const disciplina = buscarDisciplina(row.disciplinaId);
    if (!disciplina) return null;
    return {
        id: row.id,
        titulo: row.titulo,
        dataHora: row.dataHora,
        ativa: row.ativa === 1,
        disciplina,
    };
}