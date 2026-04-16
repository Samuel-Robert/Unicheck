import { db } from "./db";
import { Disciplina } from "@/types/disciplina";
import { buscarTurma } from "./turmasDao";
import { buscarProfessor } from "./professoresDao";

export function upsertDisciplina (d: Disciplina): void {
    db.runAsync(`INSERT OR REPLACE INTO disciplinas (id, nome, codigo, turmaId, professorId) VALUES (?, ?, ?, ?, ?)`,
        [d.id, d.nome, d.codigo ?? null, d.turma.id, d.professor.id]
    );
}

export function listarDisciplinas(): Disciplina[] {
    return db.getAllSync<any>(`SELECT * FROM disciplinas ORDER BY nome`)
        .map(row => montarDisciplina(row))
        .filter((d): d is Disciplina => d !== null);
}

export function listarPorTurma(turmaId: string): Disciplina[] {
    return db.getAllSync<any>(`SELECT * FROM disciplinas WHERE turmaId = ?`, [turmaId])
        .map(row => montarDisciplina(row))
        .filter((d): d is Disciplina => d !== null);
}

export function listarPorProfessor(professorId: string): Disciplina[] {
    return db.getAllSync<any>(`SELECT * FROM disciplinas WHERE professorId = ?`, [professorId])
        .map(row => montarDisciplina(row))
        .filter((d): d is Disciplina => d !== null);
}

export function buscarDisciplina (id: string): Disciplina | null {
    const row = db.getFirstSync<any>(`SELECT * FROM disciplinas WHERE id = ?`, [id]);
    if (!row) return null;
    return montarDisciplina(row);
}

function montarDisciplina(row: any): Disciplina | null {
    const turma = buscarTurma(row.turmaId);
    const professor = buscarProfessor(row.professorId);
    if (!turma || !professor) return null;
    return {
        id: row.id,
        nome: row.nome,
        codigo: row.codigo,
        turma,
        professor,
    }
}