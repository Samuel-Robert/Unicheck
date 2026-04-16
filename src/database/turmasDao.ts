import { db } from "./db";
import { Turma } from "@/types/turma";

export function upsertTurma (turma: Turma): void {
    db.runAsync(`INSERT OR REPLACE INTO turmas (id, periodo, curso, identificacao) VALUES (?, ?, ?, ?)`,
        [turma.id, turma.periodo, turma.curso, turma.identificacao]
    );
}

export function listarTurmas(): Turma[]{
    return db.getAllSync <Turma>(`SELECT * FROM turmas ORDER BY curso, periodo`);
}

export function buscarTurma (id: string): Turma | null {
    return db.getFirstSync<Turma>(`SELECT * FROM turmas WHERE id = ?`, [id]) ?? null;
}

export function deletarTurma(id: string): void {
    db.runSync(`DELETE FROM turmas WHERE id = ?`, [id]);
}