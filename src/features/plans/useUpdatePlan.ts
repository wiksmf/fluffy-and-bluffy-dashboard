import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updatePlan as updatePlanApi } from "../../services/apiPlans";

type PlanData = {
  name: string;
  description: string;
  price: number;
};

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editPlan } = useMutation({
    mutationFn: ({ planData, id }: { planData: PlanData; id: number }) =>
      updatePlanApi(planData, id),
    onSuccess: () => {
      toast.success("Plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isEditing, editPlan };
}
