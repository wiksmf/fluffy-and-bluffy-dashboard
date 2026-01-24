import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getUser, type User } from "../../services/apiUsers";

export function useUser(userId?: string) {
  const { isPending: isLoading, data: user } = useQuery<User | null>({
    queryKey: userId ? ["user", userId] : ["user"],
    queryFn: userId ? () => getUser(userId) : getCurrentUser,
    enabled: !userId || !!userId,
  });

  return {
    isLoading,
    user,
    isAuthenticated: !!user,
    isAdmin: user?.user_metadata?.isAdmin || false,
  };
}
