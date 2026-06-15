import { useState, useEffect, DependencyList } from 'react';

/**
 * Estado del fetch en curso
 * - `data` arranca en `null` y queda en `null` mientras carga o si falla
 * - `isLoading` arranca en `true` y se apaga cuando el fetch termina (ok o error)
 * - `error` queda en `null` salvo que el fetcher rechace; en ese caso guarda la `Error`
 * Los tres campos son mutuamente excluyentes en estados estables:
 *   - cargando:    { data: null, isLoading: true,  error: null }
 *   - éxito:       { data: T,    isLoading: false, error: null }
 *   - fracaso:     { data: null, isLoading: false, error: Error }
 */
export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Lo que devuelve el hook: el estado del fetch + helpers para mutarlo
 */
export interface FetchHandle<T> extends FetchState<T> {
  /** Dispara una nueva ejecución del `fetcher` (útil después de mutaciones que invalidan la data)*/
  refetch: () => void;
  /**
   * Aplica un update local a `data` sin pegarle al BE — para optimistic updates
   * El updater recibe el `data` actual (garantizado no-null: si todavía no cargó, la llamada es no-op). Igual que `setState(prev => ...)` pero acotado a `data`
   * ```ts
   * await acceptProposal(id);
   * setData(prev => prev.map(p => p.id === id ? { ...p, status: 'ACEPTADA' } : p));
   * ```
   */
  setData: (updater: (prev: T) => T) => void;
}

/**
 * Encapsula el patrón `useState(data) + useState(loading) + useState(error) + useEffect(fetch)` que aparecía repetido en casi todas las pages
 * ## Uso típico
 * ```ts
 * // Fetch al montar la page, sin deps externas
 * const { data: auctions, isLoading, error } = useFetch(() => getActiveAuctions(), []);
 *
 * // Fetch que depende de un valor (re-corre si `id` cambia)
 * const { data: user, isLoading } = useFetch(() => getUserById(id), [id]);
 * ```
 *
 * ## Cómo funciona internamente
 * Un solo `useEffect` corre cada vez que cambian los `deps`:
 *   1. Setea el estado a "cargando" (`isLoading: true`, `data: null`, `error: null`).
 *   2. Llama al `fetcher` y espera la promise
 *   3. Si resuelve OK → guarda el `data` y baja `isLoading`
 *   4. Si rechaza → guarda el `error` y baja `isLoading`
 *
 * ## La parte sutil: la variable `cancelled`
 *
 * Cuando los `deps` cambian (o el componente se desmonta), React corre el cleanup del effect
 * anterior antes de correr el nuevo. La closure del effect viejo todavía tiene su request
 * en vuelo — si esa request termina DESPUÉS de que arrancó la nueva, sin protección
 * pisaría el state con datos obsoletos (o con un error de un id que ya no nos interesa).
 *
 * El flag `cancelled` resuelve esto: cada effect arranca con su propio `cancelled = false`
 * (variable local a esa ejecución del effect). Cuando React corre el cleanup, lo flipea a
 * `true`. Como el `.then`/`.catch` cierra sobre ese flag, al chequear `if (!cancelled)`
 * antes de `setState`, las requests obsoletas se descartan silenciosamente.
 *
 * Es el equivalente liviano a usar un `AbortController`: la request HTTP igual termina
 * (no la abortamos), pero el resultado se descarta. Suficiente para casi todos los casos.
 *
 * ## Mutaciones del `data`: `refetch` vs `setData`
 *
 * Después de una acción del usuario (aceptar propuesta, cancelar publicación, etc.), la data
 * cargada queda obsoleta. Dos formas de actualizarla:
 *
 * - **`refetch()`** — vuelve a pegarle al BE. Útil cuando el cambio es complejo o cuando
 *   confiamos más en el BE que en armar el nuevo estado a mano. Tiene un flicker breve
 *   (`isLoading: true` mientras llega la respuesta).
 *
 *   ```ts
 *   const { data, refetch } = useFetch(() => getMissingCards(userId), [userId]);
 *   await markAcquired(cardId);
 *   refetch();
 *   ```
 *
 * - **`setData(updater)`** — actualiza la copia local sin pegarle al BE (optimistic update).
 *   Sin flicker, pero arma vos el nuevo estado. El updater recibe el `data` actual
 *   garantizado no-null (si todavía no cargó, la llamada es no-op).
 *
 *   ```ts
 *   const { data, setData } = useFetch(() => getProposals(userId), [userId]);
 *   await acceptProposal(id);
 *   setData(prev => prev.map(p => p.id === id ? { ...p, status: 'ACEPTADA' } : p));
 *   ```
 *
 * Mecánica interna de `refetch`: incrementa un `refetchKey` que está incluido en los `deps`
 * del effect. Al cambiar el key, React vuelve a correr el effect → nueva llamada al `fetcher`.
 * Es la forma idiomática en React de "trigger an effect manually" — no se puede llamar
 * directo al fetcher porque rompería el control de race conditions y de loading state.
 *
 * ## Limitaciones conocidas (v1)
 *
 * - **No cachea entre componentes.** Cada `useFetch` es independiente: si dos pages
 *   distintas montan `useFetch(() => getCatalog(), [])`, se hacen dos requests. Si esto
 *   importa, evaluar React Query / SWR (lo sugirió el profe como nice-to-have).
 *
 * - **No soporta paginación / infinite scroll.** Diseñado para "cargar una cosa al montar".
 *
 * @param fetcher Función que devuelve una `Promise<T>`. Idealmente arrow inline (sin memoizar)
 *                — el control de re-ejecución pasa por `deps`, no por la identidad del fetcher.
 * @param deps    Dependencias del effect. Vacío (`[]`) = "una sola vez al montar".
 *                Incluir cualquier variable externa que el `fetcher` capture (ej. `[id]` si
 *                el fetcher llama a `getUserById(id)`).
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): FetchHandle<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });
  // Incrementarlo dispara una re-ejecución del effect (está incluido abajo en deps)
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, isLoading: true, error: null });
    fetcher()
      .then(data => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, isLoading: false, error });
      });
    return () => {
      cancelled = true;
    };
    // El fetcher no va en deps a propósito — lo controla quien usa el hook vía `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refetchKey]);

  return {
    ...state,
    refetch: () => setRefetchKey(k => k + 1),
    setData: (updater: (prev: T) => T) =>
      setState(s => s.data === null ? s : { ...s, data: updater(s.data) }),
  };
}
