import { useQuery } from "@tanstack/react-query";

import { getPlans } from "../../services/apiPlans";

export function usePlans() {
  const { isLoading, data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  return { isLoading, plans };
}
