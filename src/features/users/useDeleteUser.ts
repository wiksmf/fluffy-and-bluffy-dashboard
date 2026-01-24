import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteUser as deleteUserApi } from "../../services/apiUsers";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteUser } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deleteUser };
}
