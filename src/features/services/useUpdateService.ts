import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateService as updateServicesApi } from "../../services/apiServices";

type ServiceData = {
  name: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon?: FileList;
  preserveExistingIcon?: boolean;
};

export function useUpdateService() {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editService } = useMutation({
    mutationFn: ({
      serviceData,
      id,
    }: {
      serviceData: ServiceData;
      id: number;
    }) => updateServicesApi(serviceData, id),
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isEditing, editService };
}
