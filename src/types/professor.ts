export interface Professor {
    id: string;
    nome: string;
    email: string;
    role: 'PROFESSOR';
    fotoUrl: string | null;
    matricula: string;
}

export interface ProfessorRequest {
    nome: string;
    email: string;
    senha: string;
    matricula: string;
}

export interface AtualizarPerfilProfessorRequest {
    nome?: string;
    senha?: string;
    fotoUrl?: string;
}