import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act, cleanup } from '@testing-library/react';
import { useFetch } from './useFetch';

// La config de vitest no usa `globals: true`, así que testing-library no registra
// su cleanup automático. Lo hacemos a mano para que no se filtre estado entre tests.
afterEach(cleanup);

// Helper: promesa "diferida" que resolvemos/rechazamos a mano desde el test.
// Sirve para controlar el timing — clave en el caso de race condition.
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('useFetch', () => {
  it('arranca en loading y expone la data cuando el fetcher resuelve', async () => {
    const fetcher = vi.fn().mockResolvedValue(['a', 'b']);
    const { result } = renderHook(() => useFetch(fetcher, []));

    // Estado inicial: cargando, sin data ni error.
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(['a', 'b']);
    expect(result.current.error).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('guarda el error y deja data en null cuando el fetcher rechaza', async () => {
    const boom = new Error('boom');
    const fetcher = vi.fn().mockRejectedValue(boom);
    const { result } = renderHook(() => useFetch(fetcher, []));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe(boom);
    expect(result.current.data).toBeNull();
  });

  it('re-ejecuta el fetcher cuando cambian las deps', async () => {
    const fetcher = vi.fn((id: string) => Promise.resolve(`user-${id}`));
    const { result, rerender } = renderHook(
      ({ id }) => useFetch(() => fetcher(id), [id]),
      { initialProps: { id: '1' } },
    );

    await waitFor(() => expect(result.current.data).toBe('user-1'));

    rerender({ id: '2' });
    await waitFor(() => expect(result.current.data).toBe('user-2'));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('refetch() vuelve a llamar al fetcher', async () => {
    const fetcher = vi.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useFetch(fetcher, []));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.refetch());
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });

  it('setData actualiza la copia local sin pegarle al fetcher (optimistic update)', async () => {
    const fetcher = vi.fn().mockResolvedValue([1, 2, 3]);
    const { result } = renderHook(() => useFetch<number[]>(fetcher, []));
    await waitFor(() => expect(result.current.data).toEqual([1, 2, 3]));

    act(() => result.current.setData(prev => prev.filter(n => n !== 2)));
    expect(result.current.data).toEqual([1, 3]);
    expect(fetcher).toHaveBeenCalledTimes(1); // no hubo re-fetch
  });

  it('descarta el resultado obsoleto si las deps cambian antes de que resuelva (race condition)', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const fetcher = vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(
      ({ id }) => useFetch(() => fetcher(), [id]),
      { initialProps: { id: '1' } },
    );

    // Cambiamos las deps ANTES de que resuelva el primer fetch → su effect se cancela.
    rerender({ id: '2' });

    // Resolvemos primero el vigente (segundo) y después el obsoleto (primero).
    await act(async () => { second.resolve('SECOND'); });
    await act(async () => { first.resolve('FIRST'); });

    // Gana la data vigente; la respuesta obsoleta NO pisa el estado.
    await waitFor(() => expect(result.current.data).toBe('SECOND'));
    expect(result.current.data).not.toBe('FIRST');
  });
});
