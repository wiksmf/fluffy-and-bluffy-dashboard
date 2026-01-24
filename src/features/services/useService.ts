import { useQuery } from "@tanstack/react-query";

import { getServices } from "../../services/apiServices";

export function useServices() {
  const { isPending, data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  return { isPending, services };
}
