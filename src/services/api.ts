const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class APIError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data: unknown = null
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

interface RequestConfig {
  headers?: HeadersInit;
  method?: string;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  mode?: RequestMode;
  signal?: AbortSignal | null;
  window?: any;
  body?: BodyInit | null | undefined;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Convert body to JSON string if it's an object
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'API request failed',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof TypeError) {
      throw new APIError(
        'Network error. Please check if the backend server is running.',
        0,
        null
      );
    }

    throw new APIError(
      'An unexpected error occurred',
      0,
      error
    );
  }
};

export { API_BASE_URL };