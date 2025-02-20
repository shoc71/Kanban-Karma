const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

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

export async function registerUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ApiResponse<string> = await response.json();
    console.log("Register API Response:", data);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network error. Please try again later." };
  }
}

export async function fetchTasks(token: string) {
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
