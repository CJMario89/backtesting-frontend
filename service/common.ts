const API_URL = 'http://localhost:3000';
export const postRequest = (url: string, body: Record<string, string>) => {
  console.log(body);
  return fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
export const getRequest = (url: string, query: Record<string, string>) => {
  if (query) {
    return fetch(`${API_URL}${url}?${new URLSearchParams(query)}`);
  }
  return fetch(url);
};
