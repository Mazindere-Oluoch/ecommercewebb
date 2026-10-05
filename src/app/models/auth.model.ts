export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdOn: string;
}
