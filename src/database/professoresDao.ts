import { db } from "./db";
import { Professor } from "@/types/professor";

export function upsertProfessor (p: Professor): void {
    db.runAsync(`INSERT OR REPLACE INTO professores (id, nome, email, fotoUrl) VALUES (?, ?, ?, ?)`,
        [p.id, p.nome, p.email, p.fotoUrl ?? null]
    );
}

export function listarProfessores(): Professor[] {
    return db.getAllSync<any>(`SELECT * FROM professores ORDER BY nome`) 
    .map(row => ({
        ...row,
        role: 'PROFESSOR' as const,
    }))
}

export function buscarProfessor (id: string): Professor | null {
    const row = db.getFirstSync<any>(`SELECT * FROM professores WHERE id = ?`, [id]);
    if (!row) return null;
    return {
        ...row,
        role: 'PROFESSOR' as const,
    };
}

export function deletarProfessor(id: string): void {
    db.runSync(`DELETE FROM professores WHERE id = ?`, [id]);
}