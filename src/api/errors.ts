import axios from 'axios';

// Бэкенд недоступен: сетевая ошибка (сервис не запущен) или 5xx.
// Ответы 4xx (401/403/404) означают, что сервис работает.
export const isBackendUnavailable = (error: unknown): boolean => {
  return axios.isAxiosError(error) && (!error.response || error.response.status >= 500);
};

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (!error.response) return 'Бэкенд недоступен';
    return `Ошибка запроса (${error.response.status})`;
  }
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
};