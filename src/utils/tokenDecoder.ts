import { JwtPayload } from "@/types/auth";

export function decodificarToken(token: string): JwtPayload {
    const partes = token.split('.');
    if (partes.length !== 3) {
        throw new Error('Token JWT inválido - deve ter 3 partes');
    }

    const payloadBase64 = partes[1];
    const payloadBase64padrao = payloadBase64
    .replace(/-/g, '+')
    .replace(/_/g, '/');

    const payloadJson = atob(payloadBase64padrao);
    return JSON.parse(payloadJson) as JwtPayload;
}

export function tokenExpirado(token: string): boolean {
    try {
        const payload = decodificarToken(token);
        return payload.exp * 1000 < Date.now();
    } catch {
        return true
    }
}