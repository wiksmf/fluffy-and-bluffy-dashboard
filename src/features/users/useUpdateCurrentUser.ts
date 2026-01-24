import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateCurrentUser as updateCurrentUserApi } from "../../services/apiUsers";

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateCurrentUser } = useMutation({
    mutationFn: updateCurrentUserApi,
    onSuccess: () => {
      toast.success("Account successfully updated");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isPending, updateCurrentUser };
}
