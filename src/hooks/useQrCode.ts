import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { buscarQrCode, salvarQrCode } from '../database/alunosDao';
import { isOnline } from '../utils/networkUtils';

export function useQrCode(alunoId: string) {
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (alunoId) carregar();
  }, [alunoId]);

  async function carregar() {
    const cache = buscarQrCode(alunoId);
    if (cache) {
      setQrCodeUri(cache);
      setLoading(false);
      return;
    }

    if (!(await isOnline())) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/qrcode/aluno/${alunoId}`, {
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');

      const uri = `data:image/png;base64,${base64}`;

      salvarQrCode(alunoId, uri);
      setQrCodeUri(uri);

    } catch {}

    setLoading(false);
  }

  return { qrCodeUri, loading };
}