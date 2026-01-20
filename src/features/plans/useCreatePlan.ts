import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createPlan as createPlanApi } from "../../services/apiPlans";

type PlanData = {
  name: string;
  description: string;
  price: number;
};

export function useCreatePlan() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createPlan } = useMutation({
    mutationFn: (planData: PlanData) => createPlanApi(planData),
    onSuccess: () => {
      toast.success("New plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isCreating, createPlan };
}
