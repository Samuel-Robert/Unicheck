import { db } from "./db";
import { Aluno } from "@/types/aluno";
import { buscarTurma } from "./turmasDao";

export function upsertAluno (a: Aluno): void {
    db.runSync(`INSERT OR REPLACE INTO alunos (id,nome, maticula, email, fotoUrl, turmaId) VaLUES (?, ?, ?, ?, ?, ?)`,
        [a.id, a.nome, a.matricula, a.email, a.fotoUrl ?? null, a.turmas.id]
    );
}

export function listarAlunos(): Aluno[] {
    const rows = db.getAllSync<any>(`SELECT * FROM alunos ORDER BY nome`);
    return rows.map(row => montarAluno(row));
}

export function listarPorTurma(turmaId: string): Aluno[] {
    const rows = db.getAllSync<any>(`SELECT * FROM alunos WHERE turmaId = ? ORDER BY nome`, [turmaId]);
    return rows.map(row => montarAluno(row));
}

export function buscarAluno (id: string): Aluno | null {
    const row = db.getFirstSync<any>(`SELECT * FROM alunos WHERE id = ?`, [id]);
    if (!row) return null;
    return montarAluno(row);
}

export function deletarAluno(id: string): void {
    db.runSync(`DELETE FROM alunos WHERE id = ?`, [id]);
}

export function salvarQrCode(alunoId: string, base64: string): void {   
    db.runSync(`UPDATE alunos SET qrCode = ? WHERE id = ?` , [base64, alunoId]);
}

export function buscarQrCode(alunoId: string): string | null {
    const row = db.getFirstSync<{ qrCodeBase64: string | null }>(`SELECT qrCodeBase64 FROM alunos WHERE id = ?`, [alunoId]);
    return row?.qrCodeBase64 ?? null;
}

function montarAluno(row: any): Aluno {
    const turma = buscarTurma(row.turmaId);
    return {
        id: row.id,
        nome: row.nome,
        matricula: row.matricula,
        email: row.email,
        fotoUrl: row.fotoUrl,
        role: 'ALUNO',
        turmas: turma ?? {id: row.turmaId, periodo: '', curso: '', identificacao: ''},
    }
}   