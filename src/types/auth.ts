export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
}

export interface JwtPayload {
    sub: string;
    role: string
    exp: number; 
}

export type Role = 'ALUNO' | 'PROFESSOR' | 'GESTOR';

export interface AuthUser {
    id: string;
    nome: string;
    email: string;
    role: Role;
    fotoUrl: string | null;
}