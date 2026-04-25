
// Câmera para escanear o QR Code do aluno.

// IMPORTANTE: usa expo-camera não usa o expo-barcode-scanner que foi descontinuado
// permissões de câmera 

import { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// CameraView: o componente de câmera do expo-camera SDK 54+
// useCameraPermissions: hook para gerenciar permissão de câmera

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface QrCodeScannerProps {
  onScan:  (qrCode: string) => void;  // callback chamado quando um QR é lido
  onClose: () => void;                // callback para fechar o scanner
}

// Regex para validar UUID: formato "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
// ^ = início da string
// [0-9a-f]{8} = 8 caracteres hexadecimais
// - = hífen literal
// $ = fim da string
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function QrCodeScanner({ onScan, onClose }: QrCodeScannerProps) {
  // useCameraPermissions:
  // permission = { granted: boolean, status: string }
  // requestPermission = pedir permissão ao usuário
  const [permission, requestPermission] = useCameraPermissions();

  // useRef: guarda o timer de debounce sem causar re-render
  // <ReturnType<typeof setTimeout>> = tipo do retorno do setTimeout
  // null = valor inicial (nenhum timer ativo)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Permissão não solicitada ainda ─────────────────────
  if (!permission) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.texto}>Carregando permissão de câmera...</Text>
      </View>
    );
  }

  // ── Permissão negada ────────────────────────────────────
  if (!permission.granted) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.texto}>
          Permissão de câmera necessária para escanear QR Codes.
        </Text>
        <TouchableOpacity style={styles.botao} onPress={requestPermission}>
          <Text style={styles.botaoTexto}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Câmera com scanner ──────────────────────────────────
  const handleBarcode = ({ data }: { data: string }) => {
    // Debounce: ignora leituras repetidas por 2 segundos
    if (debounceRef.current) return;
    // Se debounceRef.current tem um timer ativo, ignora esta leitura

    // Valida se o conteúdo é um UUID (formato esperado do QR Code)
    if (!UUID_REGEX.test(data)) return;
    // .test(data) = retorna true se a string corresponde ao padrão

    // Chama o callback com o UUID do aluno
    onScan(data);

    // Ativa o bloqueio por 2 segundos (evita leituras duplicadas)
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;   // libera para nova leitura
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Botão de fechar no canto superior direito */}
      <TouchableOpacity style={styles.fechar} onPress={onClose}>
        <Ionicons name="close-circle" size={36} color={Colors.white} />
      </TouchableOpacity>

      {/* CameraView: o componente de câmera */}
      <CameraView
        style={styles.camera}
        facing="back"   // câmera traseira
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],   // lê apenas QR Codes (ignora outros tipos)
        }}
        onBarcodeScanned={handleBarcode}
        // onBarcodeScanned: chamado toda vez que a câmera detecta um código
      >
        {/* Overlay: moldura visual para guiar o usuário */}
        <View style={styles.overlay}>
          <View style={styles.moldura} />
          <Text style={styles.instrucao}>
            Aponte para o QR Code do aluno
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  fechar: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 10,   // fica por cima da câmera
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  moldura: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 16,
    // Fundo transparente — mostra o que a câmera está vendo
    backgroundColor: 'transparent',
  },
  instrucao: {
    fontSize: Typography.sizes.md,
    color: Colors.white,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
    gap: 16,
  },
  texto: {
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: Colors.primaryMedium,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  botaoTexto: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
});