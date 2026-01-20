import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deletePlan as deletePlanApi } from "../../services/apiPlans";

export function useDeletePlan() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deletePlan } = useMutation({
    mutationFn: deletePlanApi,
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deletePlan };
}
