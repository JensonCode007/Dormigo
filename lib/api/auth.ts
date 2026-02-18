import { apiFetch } from './client';

export interface AuthResponse {
  token: string;
  userId: number;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  role: string;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

export async function signupApi(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<UserResponse> {
  return apiFetch<UserResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
    skipAuth: true,
  });
}
