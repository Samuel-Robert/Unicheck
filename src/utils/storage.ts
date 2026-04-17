import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = '@unicheck:token';

export async function salvarToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function lerToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function removerToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
}
