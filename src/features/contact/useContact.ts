import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../../services/apiContact";

export function useContact() {
  const {
    isLoading,
    error,
    data: contacts,
  } = useQuery({
    queryKey: ["contact"],
    queryFn: getContacts,
  });

  return { isLoading, error, contacts };
}
