import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
});                                                                                             

export const criarAlunoSchema = z.object({
    nome: z.string().min(3, 'Nome muito curto'),
    matricula: z.string().min(1, 'Matrícula obrigatória'),
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
    turmaId: z.string().uuid('Selecione uma turma'),
});

export const criarProfessorSchema = z.object({
    nome: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

export const criarTurmaSchema = z.object({
    periodo: z.string().min(1, 'Período obrigatório'),
    curso: z.string().min(3, 'Curso obrigatório'),
    identificacao: z.string().min(1, 'Identificação obrigatória'),
});

export const perfilSchema = z.object({
    nome: z.string().min(3).optional(),
    senha: z.string().min(6).optional().or(z.literal('')),
});
