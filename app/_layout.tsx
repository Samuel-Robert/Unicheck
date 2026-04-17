import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { runMigrations } from "@/database/migrations";
import { useAuthStore } from "@/store/authStore";

export default function RootLayout() {
    const loadFromStorage = useAuthStore(s => s.loadFromStorage);

    useEffect(() => {
        runMigrations();
        loadFromStorage();
    }, []);

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#0D2A5C" />
            <Stack screenOptions={{ headerShown: false }} />
        </>
    )
}