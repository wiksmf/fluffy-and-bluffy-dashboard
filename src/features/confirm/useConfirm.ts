import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

export function useConfirm() {
  const queryClient = useQueryClient();

  const { mutate: confirm, isPending } = useMutation({
    mutationFn: (bookingId: string | number) =>
      updateBooking(bookingId, {
        status: "confirmed",
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully confirmed!`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: () =>
      toast.error("There was an error while confirming the booking."),
  });

  return { confirm, isPending };
}
