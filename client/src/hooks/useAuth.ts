import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  userId: number;
  workspaceId: number;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
  };
}
