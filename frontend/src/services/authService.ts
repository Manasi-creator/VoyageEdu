const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
  preferredStreams?: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

const handleAuthResponse = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload?.error === "string" ? payload.error : "Authentication failed. Please try again.";
    throw new Error(message);
  }
  return payload as AuthResponse;
};

export const signupUser = async (data: SignupPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleAuthResponse(response);
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleAuthResponse(response);
};
