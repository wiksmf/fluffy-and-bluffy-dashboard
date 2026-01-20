import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { updateContact as updateContactApi } from "../../services/apiContact";

export function useUpdateContact() {
  const queryClient = useQueryClient();

  const { mutate: updateContact, isPending: isUpdating } = useMutation({
    mutationFn: updateContactApi,
    onSuccess: () => {
      toast.success("Contact successfully updated");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateContact };
}
