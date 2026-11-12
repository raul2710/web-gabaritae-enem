'use client';

import { useEffect, useState } from 'react';

/**
 * `true` apenas depois da hidratação no cliente.
 *
 * Stores Zustand com `persist` leem `localStorage`, que não existe no
 * servidor: ler dados persistidos no primeiro paint causaria mismatch de SSR.
 * O valor inicial `false` é idêntico no servidor e no cliente, e o
 * `useEffect` (só executado no navegador) marca a hidratação como concluída.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Marcação de montagem única (não é estado derivado de props/estado):
    // sincroniza com o ambiente do navegador, exatamente o papel de um efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação: setState só roda uma vez, no mount, no cliente.
    setHydrated(true);
  }, []);

  return hydrated;
}
