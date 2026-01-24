import { useQuery } from "@tanstack/react-query";
import { getUsers, type User } from "../../services/apiUsers";

export function useUsers() {
  const { isPending, data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { isPending, users };
}
