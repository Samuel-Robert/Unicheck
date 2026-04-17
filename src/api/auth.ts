import { api } from "./client";
import { LoginRequest, LoginResponse } from "@/types/auth";

export async function loginApi(dados: LoginRequest): Promise<string> {
    const { data } = await api.post<LoginResponse>('/auth/login', dados);
    return data.token;
}

