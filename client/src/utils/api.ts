

const API_URL = process.env.REACT_APP_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function loginUser(email: string, password: string): Promise<ApiResponse<string>> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data;
}

export async function fetchTasks(token: string): Promise<ApiResponse<any[]>> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Fetching tasks failed');
  }

  const data = await response.json();
  return data;
}
