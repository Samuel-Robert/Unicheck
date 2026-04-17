export const Colors = { 
    
    // Azul Unicheck 

    primary: '#0D2A5C',
    primaryMedium: '#1E5AA8',
    PrimaryLight: '#2FA4E7',

    // Verde Unicheck 

    success: '#2FBF4A',
    successDark: '#1F8F3A',

    // Neutros

    white: '#FFFFFF',
    background: '#F5F7FA',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    card: '#FFFFFF',

    // Estados 

    error: '#EF4444',
    warning: '#F59E0B',
} as const;

export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,                                                                   
    }, 
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
}as const;