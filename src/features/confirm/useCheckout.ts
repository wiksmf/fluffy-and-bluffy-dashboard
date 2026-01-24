import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

export function useCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: ({
      bookingId,
      paidAmount,
    }: {
      bookingId: string | number;
      paidAmount: number;
    }) =>
      updateBooking(bookingId, {
        status: "done",
        paid_amount: paidAmount,
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully closed!`);
      queryClient.invalidateQueries({ active: true });
      navigate(`/booking/${data.id}`);
    },

    onError: () => toast.error("There was an error while closing the booking."),
  });

  return { checkout, isCheckingOut };
}
