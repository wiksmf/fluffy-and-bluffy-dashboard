import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../services/apiServices";

export function useServices() {
  const {
    isLoading,
    data: services,
    error,
  } = useQuery({
    queryFn: getServices,
    queryKey: ["services"],
  });

  return { isLoading, services, error };
}
