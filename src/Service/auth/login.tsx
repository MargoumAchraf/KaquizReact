import { api } from '../Api';

export const Login = async (email: string, password: string) => {
  try {
    const url = `${api}/api/auth/login`;
    console.log('Login URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error body:', errorText);
      throw new Error(`Failed to log in (${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};