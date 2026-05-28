export interface AuthUser {
  id: number
  email: string
  name: string
}

export interface AuthResponse {
  token?: string
  user?: AuthUser
  error?: string
}
