import { db } from './db';

export function runMigrations(): void {
    db.execAsync(`
        -- WAL mode: melhor performance para apps mobile
        
        PRAGMA journal_mode = WAL;

        -- Tabela de Turmas

        CREATE TABLE IF NOT EXISTS turmas (
            id TEXT PRIMARY KEY,
            periodo TEXT NOT NULL,
            curso TEXT NOT NULL,
            identificacao TEXT NOT NULL
        );
        
        -- Tabela de professores

        CREATE TABLE IF NOT EXISTS professores (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT NOT NULL
            fotoUrl TEXT
        );

        -- Tabela de alunos 

        CREATE TABLE IF NOT EXISTS alunos (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            matricula TEXT NOT NULL,
            email TEXT NOT NULL,
            fotoUrl TEXT,
            turmaId TEXT NOT NULL,
            qrCodeBase64 TEXT,
            FOREIGN KEY (turmaId) REFERENCES turmas(id)
        );

        -- tabela de Disciplinas

        CREATE TABLE IF NOT EXISTS disciplinas (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            codigo TEXT,
            turmaId TEXT NOT NULL,
            professorId TEXT NOT NULL,
            FoREIGN KEY (turmaId) REFERENCES turmas(id),
            FOREIGN KEY (professorId) REFERENCES professores(id)
        );

        -- Tabela de Aulas

        CREATE TABLE IF NOT EXISTS aulas (
            id TEXT PRIMARY KEY,
            titulo TEXT NOT NULL,
            dataHora TEXT NOT NULL,
            ativa INTEGER NOT NULL DEFAULT 1,
            disciplinaId TEXT NOT NULL,
            sincronizado INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (disciplinaId) REFERENCES disciplinas(id)
        );
        
        -- Tabela de Presenças 

        CREATE TABLE IF NOT EXISTS presencas (
            id TEXT PRIMARY KEY,
            alunoId TEXT NOT NULL,
            aulaId TEXT NOT NULL,
            dataHora TEXT NOT NULL,
            sincronizado INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (alunoId) REFERENCES alunos(id),
            FOREIGN KEY (aulaId) REFERENCES aulas(id)
        );
        
        -- Tabela de Horários

        CREATE TABLE IF NOT EXISTS horarios (
            id TEXT PRIMARY KEY,
            diaSemana TEXT NOT NULL,
            horaInicio TEXT NOT NULL,
            horaFim TEXT NOT NULL,
            disciplinaId TEXT NOT NULL,
            FOREIGN KEY (disciplinaId) REFERENCES disciplinas(id)
        );
        
        -- Fila de Sync 

        CREATE TABLE IF NOT EXISTS fila_sync (
            id TEXT PRIMARY KEY,
            tipo TEXT NOT NULL,
            payload TEXT NOT NULL,
            tentativas INTEGER NOT NULL DEFAULT 0,
            criadoEm TEXT NOT NULL,
            erro TEXT
        );
        `)
}