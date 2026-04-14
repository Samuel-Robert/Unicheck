export const BASE_URL = 'https://192.168.100.77:8080';

export const Endpoints ={
    auth: {
        login: '/auth/login',
    },
    turmas: '/turmas',
    professores: '/professores',
    alunos: '/alunos',
    disciplinas: '/disciplinas',
    aulas: {
        iniciar: '/aulas/iniciar',
        encerrar: (id: string) => `/aulas/${id}/encerrar`,
        porDisciplina: (disciplinaId: string) => `/aulas/disciplina/${disciplinaId}`,
    },
    qrcode: {
        aluno : (alunoId: string) => `/qrcode/aluno/${alunoId}`,
    }, 
    presenças: {
        registrar: '/presencas/registrar',
        sincronizar: '/presencas/sincronizar',
        porAluno: (id: string) => `/presencas/aluno/${id}`,
        porDisciplina: (id: string) => `/presencas/disciplina/${id}`,
        dashboard: '/presencas/dashboard',
        dashboardProfessor: (id: string) => `/presencas/dashboard/professor/${id}`,
    },
    horarios: {
        criar: '/horarios',
        porDisciplina: (id: string) => `/horarios/disciplina/${id}`,
        porId: (id: string) => `/horarios/${id}`,
    }
} as const;