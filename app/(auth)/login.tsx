import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
/* Platform => identificar dispositivo, se é IOS ou ANDROID */
import { router } from 'expo-router'
import { loginApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { decodificarToken } from "@/utils/tokenDecoder";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { loginSchema } from "@/utils/validators";

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    const login = useAuthStore(s => s.login); 

    async function handleLogin() { 
        setErroEmail('');
        setErroSenha('');

        const resultado = loginSchema.safeParse({ email, senha })

        if( !resultado.success ) {
            resultado.error.issues.forEach(e => {
                if (e.path[0] === 'email') setErroEmail(e.message);
                if (e.path[0] === 'senha') setErroSenha(e.message)
            })
            return;
        }

        setLoading(true);
        try { 
            const token = await loginApi ({ email , senha });
            const payload = decodificarToken(token);
            
            await login(token, {
                id: '',
                nome: '',
                email: payload.sub,
                role: payload.role as any,
                fotoUrl: null,
            });


            if (payload.role === 'ALUNO')  router.replace('/(aluno)');
            else if (payload.role === 'PROFESSOR')  router.replace('/(professor)');
            else if (payload.role === 'GESTOR')  router.replace('/(gestor)');
        } catch (error: any) {

            const status = error?.response?.status;
            if(status == 401 || status === 400) { 
                Alert.alert('Erro de Login', 'Email ou senha incorretos.')
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possivel conectar à API. Verifique se a API está rodando e se o IP está correto em endpoints.ts.')
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.background}>
                <Image source={require('../../assets/images/LogoBranco.png')} style={styles.logo} resizeMode="contain"  />

                <View style={styles.card}>
                    <Text style={styles.titulo}>Bem-Vindo</Text>
                    <Text style={styles.subtitulo}>Entre com suas credenciais</Text>

                    {/* Campo Email */}
                    <View style={styles.campoContainer}>
                        <Text style={styles.label}>Email institucional</Text>
                        <TextInput 
                        style={[styles.input, erroEmail ? styles.inputErro : null]}
                        placeholder="seu@email.com"
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                        />

                        {erroEmail ? <Text style={styles.textoErro}>{erroEmail}</Text> : null}

                    </View>

                    {/* Campo Senha */}
                    <View style={styles.campoContainer}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput 
                        style={[styles.input, erroSenha ? styles.inputErro : null]}
                        placeholder="Sua senha"
                        placeholderTextColor={Colors.textSecondary}
                        secureTextEntry
                        value={email}
                        onChangeText={setEmail}
                        />

                        {erroSenha ? <Text style={styles.textoErro}>{erroSenha}</Text> : null}

                    </View>

                    {/* botão entrar */}
                    <TouchableOpacity 
                    style={[styles.botao, loading && styles.botaoDesabilitado]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                    >
                        {loading
                            ? <ActivityIndicator color={Colors.white} />
                            : <Text style={styles.botaoTexto}>Entrar</Text>
                        }
                    </TouchableOpacity>
                </View>

                <Text style={styles.rodape}>Unicheck © 2026</Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    background: {
        flex: 1,
        backgroundColor: Colors.primary, 
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logo: {
        width: 180,
        height: 60, 
        marginBottom: 32,
    },
    card: {
        width: '100%',
        backgroundColor:Colors.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    titulo: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    subtitulo: {
        fontSize: Typography.sizes.sm,
        color: Colors.textSecondary,
        marginBottom: 24,
    },
    campoContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: Typography.sizes.md,
        color: Colors.textPrimary,
        backgroundColor: Colors.background,
    },
    inputErro: {
        borderColor: Colors.error,   
    },
    textoErro: {
        fontSize: Typography.sizes.xs,
        color: Colors.error,
        marginTop: 4,
    },
    botao: {
        backgroundColor: Colors.primaryMedium,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    botaoDesabilitado: {
        opacity: 0.6,   
    },
    botaoTexto: {
        color: Colors.white,
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
    },
    rodape: {
        marginTop: 32,
        fontSize: Typography.sizes.xs,
        color: 'rgba(255,255,255,0.4)',   
    },
})