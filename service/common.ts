const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const postRequest = (url: string, body: Record<string, string>) => {
  return fetch(`${API_URL}${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
export const getRequest = (url: string, query?: Record<string, string>) => {
  let requestUrl = query
    ? `${API_URL}${url}?${new URLSearchParams(query)}`
    : `${API_URL}${url}`;

  return fetch(requestUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
