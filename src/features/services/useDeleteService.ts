import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteService as deleteServiceApi } from "../../services/apiServices";

export function useDeleteService() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteService } = useMutation({
    mutationFn: deleteServiceApi,
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deleteService };
}
