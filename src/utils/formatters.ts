import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DiaSemana } from "@/types/horario";
import { Colors } from "@/constants/colors";

export function formatarData(isostring: string): string {
    return format(parseISO(isostring), "d 'de' MMM. 'de' yyyy", { locale: ptBR });
}

export function formatarHora(isostring : string): string {
    return format(parseISO(isostring), "HH:mm");
}

export function formatarIntervalo(inicio: string, fim: string): string {
    return `${inicio} - ${fim}`;
}

export function formatarDiaSemana(dia: DiaSemana): string {
    const mapa: Record<DiaSemana, string> = {
        MONDAY: 'Segunda-feira',
        TUESDAY: 'Terça-feira',
        WEDNESDAY: 'Quarta-feira',
        THURSDAY: 'Quinta-feira',
        FRIDAY: 'Sexta-feira',
    };
    return mapa[dia];
}

export function formatarPercentual(valor: number): string {
    return `${valor.toFixed(1).replace('.', ',')}%`;
}

export function corPresenca(percentual: number): string {
    if (percentual >= 75) return Colors.success;
    if (percentual >= 50) return Colors.warning;
    return Colors.error;
}