import { useEffect } from 'react'; 
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';

export default function Index() { 
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {

        const timer = setTimeout(() => {
            if ( !isAuthenticated || !user) {
                router.replace('/(auth)/login');
            } else if (user.role === 'ALUNO') {
                router.replace('/(aluno)');
            } else if (user.role === 'PROFESSOR') {
                router.replace('/(professor)');
            } else if (user.role === 'GESTOR') {
                router.replace('/(gestor)');
            }
        }, 800);

        return () => clearTimeout(timer);

    }, [isAuthenticated, user]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.white} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,

        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',   
    },
});