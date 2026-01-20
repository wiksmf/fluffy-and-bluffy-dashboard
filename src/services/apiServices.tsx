import supabase from "./supabase";

export async function getServices() {
  const { data, error } = await supabase.from("services").select("*");

  if (error) {
    console.error(error);
    throw new Error("Error fetching services");
  }

  return data;
}

export async function createService(newService: {
  title: string;
  description: string;
  short_description?: string;
  show_home?: boolean;
  icon: FileList;
}) {
  const { data, error } = await supabase
    .from("services")
    .insert([
      {
        title: newService.title,
        description: newService.description,
        short_description: newService.short_description,
        show_home: newService.show_home,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error adding service");
  }

  const imageFile = newService.icon[0];
  const iconName = `${Math.random()}-${imageFile.name}`.replace(/\//g, "");

  const { error: storageError } = await supabase.storage
    .from("services-icons")
    .upload(iconName, imageFile);

  if (storageError) {
    await supabase.from("services").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Service image could not be uploaded and the service was not created"
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("services-icons").getPublicUrl(iconName);

  const { data: updatedService, error: updateError } = await supabase
    .from("services")
    .update({ icon: publicUrl })
    .eq("id", data.id)
    .select()
    .single();

  if (updateError) {
    console.error(updateError);
    throw new Error("Error updating service with image URL");
  }

  return updatedService;
}

export async function updateService(
  newService: {
    title: string;
    description: string;
    short_description?: string;
    show_home?: boolean;
    icon?: FileList;
    preserveExistingIcon?: boolean;
  },
  id?: number
) {
  const { data: currentService, error: fetchError } = await supabase
    .from("services")
    .select("icon")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching current service:", fetchError);
    throw new Error("Error fetching current service data");
  }

  let imagePath = currentService?.icon;

  if (
    newService.icon &&
    newService.icon instanceof FileList &&
    newService.icon.length > 0
  ) {
    const imageFile = newService.icon[0];
    const iconName = `${Math.random()}-${imageFile.name}`.replace(/\//g, "");

    const { error: storageError } = await supabase.storage
      .from("services-icons")
      .upload(iconName, imageFile);

    if (storageError) {
      console.error("Storage upload error:", storageError);
      throw new Error("Service icon could not be uploaded");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("services-icons").getPublicUrl(iconName);

    imagePath = publicUrl;
  }

  const serviceData = {
    title: newService.title,
    description: newService.description,
    short_description: newService.short_description,
    show_home: newService.show_home,
    icon: imagePath,
  };

  const { data, error } = await supabase
    .from("services")
    .update(serviceData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Database update error:", error);
    throw new Error("Error updating service");
  }

  return data;
}

export async function deleteService(id: number) {
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Error deleting service");
  }
}
