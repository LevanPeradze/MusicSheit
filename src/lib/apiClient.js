const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const buildUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const apiFetch = (path, options = {}) => fetch(buildUrl(path), options);

export const apiBaseUrl = apiBase;

