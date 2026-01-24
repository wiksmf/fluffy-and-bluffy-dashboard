import supabase from "./supabase";

import { PAGE_SIZE } from "../utils/constants";

interface FilterOption {
  field: string;
  value: string;
  method?: string;
}

interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

interface GetBookingsParams {
  filter?: FilterOption;
  sortBy?: SortOption;
  page?: number;
}

export async function getBookings({ filter, sortBy, page }: GetBookingsParams) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, first_name, last_name, email, phone, service, message, date, hour, status",
      { count: "exact" }
    );

  // FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id: number | string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

export async function updateBooking(
  id: number | string,
  obj: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number | string) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  return null;
}
