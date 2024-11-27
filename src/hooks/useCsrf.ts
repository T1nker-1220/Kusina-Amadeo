import { useState, useEffect } from 'react';

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/csrf');
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchToken();
  }, []);

  const withCsrf = async (url: string, options: RequestInit = {}) => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    const headers = new Headers(options.headers);
    headers.set('x-csrf-token', csrfToken);

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { csrfToken, withCsrf };
}
