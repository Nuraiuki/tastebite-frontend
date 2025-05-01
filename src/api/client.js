export const API =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const get = (url) =>
  fetch(`${API}${url}`).then((r) => r.json());
