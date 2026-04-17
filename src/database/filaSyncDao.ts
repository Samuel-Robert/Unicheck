import { db } from "./db";

export interface ItemFila{
    id: string;
    tipo: string;
    payload: string;
    tentativas: number;
    criadoEm: string;
    erro: string | null;
}

export function inserirNaFila(id: string, tipo: string, payload: object): void {
    db.runSync(`INSERT INTO fila_sync (id, tipo, payload, tentativas, criadoEm) VALUES (?, ?, ?, 0, ?)`,  
        [id, tipo, JSON.stringify(payload), new Date().toISOString()] 
    );
}

export function listarFila(): ItemFila[] {
    return db.getAllSync<ItemFila>(`SELECT * FROM fila_sync ORDER BY criadoEm ASC`);
}

export function contarPendentes(): number {
    const row = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM fila_sync WHERE erro IS NULL`);
    return row?.count ?? 0;
}

export function removerDaFila(id: string): void {
    db.runSync(`DELETE FROM fila_sync WHERE id = ?`, [id]);
}

export function incrementarTentativas(id: string): void {
    db.runSync(`UPDATE fila_sync SET tentativas = tentativas + 1 WHERE id = ?`, [id]);
}

export function registrarErro(id: string, mensagem: string): void {
    db.runSync(`UPDATE fila_sync SET erro = ? WHERE id = ?`, [mensagem, id]);
}