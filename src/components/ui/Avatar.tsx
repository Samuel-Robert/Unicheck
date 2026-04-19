import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface AvatarProps {
  nome:     string;
  fotoUrl?: string | null;
   tamanho?: number;
}
export function Avatar({ nome, fotoUrl, tamanho = 40 }: AvatarProps) {
     const iniciais = nome 
     .split(' ') 
     .slice(0, 2)
     .map(p => p[0]?.toUpperCase() ?? '')
     .join('');
     const estilo = {
    width:        tamanho,
    height:       tamanho,
    borderRadius: tamanho / 2,
};
 if (fotoUrl) {
    return <Image source={{ uri: fotoUrl }} style={[styles.imagem, estilo]} />;
}
 return (
    <View style={[styles.placeholder, estilo]}>
      <Text style={[styles.iniciais, { fontSize: tamanho * 0.35 }]}>
        {iniciais}
      </Text>
      </View>
  );
}
const styles = StyleSheet.create({
  imagem: {
    backgroundColor: Colors.border, 
  },
  placeholder: {
    backgroundColor: Colors.primaryMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iniciais: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
});