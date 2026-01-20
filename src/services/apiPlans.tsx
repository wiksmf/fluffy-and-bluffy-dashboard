import supabase from "./supabase";

export async function getPlans() {
  const { data, error } = await supabase.from("plans").select("*");

  if (error) {
    console.error(error);
    throw new Error("Error fetching plans");
  }

  return data;
}

export async function createPlan(newPlan: {
  name: string;
  description: string;
  price: number;
}) {
  const { data, error } = await supabase
    .from("plans")
    .insert([newPlan])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error adding plan");
  }

  return data;
}

export async function updatePlan(
  newPlan: {
    name: string;
    description: string;
    price: number;
  },
  id?: number
) {
  const { data, error } = await supabase
    .from("plans")
    .update(newPlan)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error editing plan");
  }

  return data;
}

export async function deletePlan(id: number) {
  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Error deleting plan");
  }
}
