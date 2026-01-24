import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateUser } from "../../services/apiUsers";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateUserMutation } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isUpdating, updateUser: updateUserMutation };
}
