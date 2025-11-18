import { useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fn().then(r => { if (mounted) setData(r); }).catch(e => { if (mounted) setError(e); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false };
  }, deps);
  return { data, loading, error };
}