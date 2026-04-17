import { db } from "./db";

export interface PresencaLocal {
    id: string;
    alunoId: string;
    aulaId: string;
    dataHora: string;
    sincronizado: boolean;
}
export function inserirPresenca(presenca: PresencaLocal): void {
    db.runSync(`INSERT INTO presencas (id, alunoId, aulaId, dataHora, sincronizado) VALUES (?, ?, ?, ?, ?)`,
        [presenca.id, presenca.alunoId, presenca.aulaId, presenca.dataHora, presenca.sincronizado ? 1 : 0]
    );
}

export function existePresenca(alunoId: string, aulaId: string): boolean {
    const row = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM presencas WHERE alunoId = ? AND aulaId = ?`, [alunoId, aulaId]);
    return (row?.count ?? 0) > 0;
}

export function listarPorAluno(alunoId: string): PresencaLocal[] {
    return db.getAllSync<any>(`SELECT * FROM presencas WHERE alunoId = ? ORDER BY dataHora DESC`, [alunoId])
    .map(row => ({ ...row, sincronizado: row.sincronizado === 1 }));
}

export function listarPorAula(aulaId: string): PresencaLocal[] {
    return db.getAllSync<any>(`SELECT * FROM presencas WHERE aulaId = ? ORDER BY dataHora`, [aulaId])
    .map(row => ({ ...row, sincronizado: row.sincronizado === 1 }));
}

export function marcarPresencaSincronizada(id: string): void {
    db.runSync(`UPDATE presencas SET sincronizado = 1 WHERE id = ?`, [id]);
}   