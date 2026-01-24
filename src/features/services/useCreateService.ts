import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createService as createServiceApi } from "../../services/apiServices";

type ServiceData = {
  name: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon: FileList;
};

export function useCreateService() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createService } = useMutation({
    mutationFn: (serviceData: ServiceData) => createServiceApi(serviceData),
    onSuccess: () => {
      toast.success("New service created successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isCreating, createService };
}
