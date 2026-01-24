import { useQuery } from "@tanstack/react-query";

import { getPlans } from "../../services/apiPlans";

export function usePlans() {
  const { isPending, data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  return { isPending, plans };
}
