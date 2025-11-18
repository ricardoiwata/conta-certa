import { auth } from "../auth/firebase";

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "");

// Debug: log the API URL being used
if (__DEV__) {
  console.log("API URL:", BASE_URL);
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

/**
 * Obter token do Firebase do usuário autenticado
 */
async function getFirebaseToken(): Promise<string | null> {
  try {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
}

async function request<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, requiresAuth = false } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = await getFirebaseToken();
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail: any = null;
    try {
      detail = await res.json();
    } catch {}
    const message = detail?.message || res.statusText || "Request failed";
    throw new Error(`${res.status} ${message}`);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export const api = {
  get: <T>(path: string, requiresAuth: boolean = false) =>
    request<T>(path, { requiresAuth }),
  post: <T>(path: string, body: any, requiresAuth: boolean = false) =>
    request<T>(path, { method: "POST", body, requiresAuth }),
  patch: <T>(path: string, body: any, requiresAuth: boolean = false) =>
    request<T>(path, { method: "PATCH", body, requiresAuth }),
  delete: <T>(path: string, requiresAuth: boolean = false) =>
    request<T>(path, { method: "DELETE", requiresAuth }),
  baseUrl: BASE_URL,
};

// ============================================================================
// Funções específicas para perfil do usuário
// ============================================================================

export interface UserProfile {
  id: number;
  firebaseUid: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * Criar novo usuário no backend (após registro no Firebase)
 */
export async function createUserProfile(data: {
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}): Promise<UserProfile> {
  if (!auth.currentUser) {
    throw new Error("Usuário não autenticado");
  }

  return api.post<UserProfile>(
    "/usuario",
    {
      firebaseUid: auth.currentUser.uid,
      email: auth.currentUser.email,
      ...data,
    },
    false // não requer auth pois é logo após registro
  );
}

/**
 * Obter perfil do usuário autenticado
 */
export async function getMyProfile(): Promise<UserProfile> {
  return api.get<UserProfile>("/usuario/perfil/me", true);
}

/**
 * Atualizar perfil do usuário autenticado
 */
export async function updateMyProfile(data: {
  nome?: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  fotoPerfil?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}): Promise<UserProfile> {
  return api.patch<UserProfile>("/usuario/perfil/me", data, true);
}

/**
 * Buscar usuário por Firebase UID
 */
export async function getUserByFirebaseUid(firebaseUid: string): Promise<UserProfile> {
  return api.get<UserProfile>(`/usuario/firebase/${firebaseUid}`, false);
}

export type ApiList<T> = T[];

