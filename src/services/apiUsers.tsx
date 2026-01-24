import supabase, { supabaseAdmin } from "./supabase";

export interface UserMetadata {
  fullName?: string;
  isAdmin?: boolean;
  avatar?: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
  created_at: string;
}

interface CreateUserParams {
  fullName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

interface UpdateUserParams {
  id: string;
  password?: string;
  fullName?: string;
  avatar?: File;
  isAdmin?: boolean;
}

export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, is_admin, avatar, created_at")
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("Error fetching users");
  }

  return data.map((user) => ({
    id: user.id,
    email: user.email || `user-${user.id.slice(0, 8)}@example.com`,
    user_metadata: {
      fullName: user.full_name,
      isAdmin: user.is_admin || false,
      avatar: user.avatar,
    },
    created_at: user.created_at,
  }));
}

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, is_admin, avatar, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("User not found");
  }

  return {
    id: data.id,
    email: data.email,
    user_metadata: {
      fullName: data.full_name,
      isAdmin: data.is_admin || false,
      avatar: data.avatar,
    },
    created_at: data.created_at,
  };
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  if (data.user) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("full_name, email, is_admin, avatar")
      .eq("id", data.user.id)
      .single();

    if (!userError && userData) {
      return {
        ...data.user,
        user_metadata: {
          ...data.user.user_metadata,
          fullName: userData.full_name,
          isAdmin: userData.is_admin || false,
          avatar: userData.avatar,
        },
      };
    }
  }

  return data?.user;
}

export async function createUser({
  fullName,
  email,
  password,
  isAdmin = false,
}: CreateUserParams) {
  if (!supabaseAdmin) {
    throw new Error(
      "Admin operations not available. Please configure VITE_SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        fullName,
        avatar: "",
      },
      email_confirm: true,
    });

  if (authError) throw new Error(authError.message);

  if (authData.user) {
    const { error: insertError } = await supabaseAdmin.from("users").upsert(
      {
        id: authData.user.id,
        full_name: fullName,
        email: email,
        is_admin: isAdmin,
        avatar: null,
      },
      {
        onConflict: "id",
      }
    );

    if (insertError) {
      console.error("Failed to create user record:", insertError);

      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      throw new Error("Failed to create user record");
    }
  }

  return authData;
}

export async function updateUser({
  id,
  password,
  fullName,
  avatar,
  isAdmin,
}: UpdateUserParams) {
  const updateData: {
    full_name?: string;
    is_admin?: boolean;
    avatar?: string;
  } = {};
  if (fullName !== undefined) updateData.full_name = fullName;
  if (isAdmin !== undefined) updateData.is_admin = isAdmin;

  if (avatar) {
    const fileName = `avatar-${id}-${Date.now()}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    updateData.avatar = publicUrl;
  }

  if (Object.keys(updateData).length > 0) {
    const { error: tableError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id);

    if (tableError) throw new Error(tableError.message);
  }

  const { data: currentUser } = await supabase.auth.getUser();
  if (currentUser.user?.id === id) {
    const authUpdateData: {
      password?: string;
      data?: { fullName?: string; avatar?: string };
    } = {};

    if (password) authUpdateData.password = password;
    if (fullName || updateData.avatar) {
      authUpdateData.data = {};
      if (fullName) authUpdateData.data.fullName = fullName;
      if (updateData.avatar) authUpdateData.data.avatar = updateData.avatar;
    }

    if (Object.keys(authUpdateData).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(
        authUpdateData
      );
      if (authError) throw new Error(authError.message);
    }
  }
}

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
  isAdmin,
}: Omit<UpdateUserParams, "id">) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error("No authenticated user");

  return updateUser({
    id: currentUser.user.id,
    password,
    fullName,
    avatar,
    isAdmin,
  });
}

export async function deleteUser(id: string) {
  if (!supabaseAdmin) {
    throw new Error(
      "Admin operations not available. Please configure VITE_SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  const { error: tableError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", id);

  if (tableError) {
    console.error("Error deleting from users table:", tableError);
    throw new Error("Error deleting user from database");
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (authError) {
    console.error("Error deleting from auth:", authError);
    throw new Error("Error deleting user from authentication system");
  }
}
