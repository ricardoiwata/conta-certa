import { onAuthStateChanged, User } from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "./firebase";
import { getMyProfile, UserProfile } from "../services/api";

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  profileError: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  profileError: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      if (auth.currentUser) {
        const profileData = await getMyProfile();
        setProfile(profileData);
        setProfileError(null);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setProfileError(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
      // Não falha se o perfil não existir ainda
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Não carrega o perfil automaticamente aqui
      // O perfil será carregado sob demanda quando necessário
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile, profileError }),
    [user, profile, loading, profileError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
