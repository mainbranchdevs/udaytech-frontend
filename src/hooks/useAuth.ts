import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, logout as logoutApi } from '../api/endpoints';
import type { User } from '../types';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await getMe();
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = !!user && !isError;
  const isAdmin = user?.role === 'admin';
  const isNewUser = isAuthenticated && user?.name === null;

  const handleLogout = async () => {
    await logoutApi();
    queryClient.clear();
    window.location.href = '/login';
  };

  return { user: user ?? null, isLoading, isAuthenticated, isAdmin, isNewUser, logout: handleLogout };
}
