// React Hook helpers for data fetching and streaming
import { useState, useEffect, useCallback } from 'react';
import {
  fetchEventSource,
  EventSourceMessage,
} from '@microsoft/fetch-event-source';

/**
 * Generic async data hook — loading / error / refetch for any `Promise` API.
 *
 * Features:
 * 1. Tracks `loading` around the call
 * 2. Normalizes thrown values to `Error` (including plain API error objects)
 * 3. Re-runs when `deps` change (same semantics as `useEffect`)
 *
 * @param apiCall - Zero-arg function returning a Promise
 * @param deps - Dependency list; default `[]` runs once on mount
 *
 * @example
 * const { data, loading, error } = useApi(() => userApi.getUserInfo());
 */
export function useApi<T>(apiCall: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      // Normalize non-Error throws (e.g. plain `{ message }`) to Error
      const errorObj =
        err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(errorObj);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Payload shape for streamed chunks — generic so each endpoint can differ.
 */
export type StreamResponse<T = any> = T;

/**
 * POST + SSE-style stream via `@microsoft/fetch-event-source`.
 * @param url - Endpoint URL
 * @param data - JSON body
 * @param onData - Called for each parsed message
 * @param onError - Optional error handler
 */
export async function streamRequest<T>(
  url: string,
  data: any,
  onData: (response: StreamResponse<T>) => void,
  onError?: (error: Error) => void
) {
  try {
    await fetchEventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      onmessage(msg: EventSourceMessage) {
        if (msg.event === 'FatalError') {
          throw new Error(msg.data);
        }
        try {
          // Parse arbitrary JSON per chunk; no fixed schema
          const parsed = JSON.parse(msg.data) as StreamResponse<T>;
          onData(parsed);
        } catch (e) {
          console.warn('Failed to parse stream chunk:', msg.data);
        }
      },
      onerror(err: any) {
        if (onError) {
          onError(err as Error);
        } else {
          console.error('Stream request failed:', err);
        }
        // Rethrow stops the library from retrying forever
        throw err;
      },
    });
  } catch (error) {
    if (onError) {
      onError(error as Error);
    }
  }
}
