const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getApiBaseUrl = () => apiBaseUrl;

export const getMediaUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;

  const mediaBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;

  return `${mediaBaseUrl}${normalizedPath}`;
};