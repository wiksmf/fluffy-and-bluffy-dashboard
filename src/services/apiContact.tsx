import supabase from "./supabase";

export async function getContacts() {
  const { data, error } = await supabase.from("contact").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Contact could not be loaded");
  }
  return data;
}

export async function updateContact(newContact: {
  phone?: string;
  email?: string;
  address?: string;
}) {
  const { data, error } = await supabase
    .from("contact")
    .update(newContact)
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Contact could not be updated");
  }
  return data;
}
