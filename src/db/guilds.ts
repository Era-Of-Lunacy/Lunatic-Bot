import type { Database } from "@/database.types.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
  process.env.SUPABASE_ANON_KEY!,
);

type Guild = Database["public"]["Tables"]["guilds"]["Row"];
type GuildInsert = Database["public"]["Tables"]["guilds"]["Insert"];
type GuildUpdate = Database["public"]["Tables"]["guilds"]["Update"];

export async function insertGuild(data: GuildInsert): Promise<Guild> {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Insert data is required");
  }

  try {
    const result = await supabase.from("guilds").insert(data).select().single();

    if (result.error || !result.data) {
      throw result.error || new Error("Guild not found");
    }

    return result.data;
  } catch (error) {
    throw new Error(
      `Failed to insert guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function getGuild(guildId: string): Promise<Guild> {
  if (!guildId) {
    throw new Error("Guild ID is required for retrievals");
  }

  try {
    const result = await supabase
      .from("guilds")
      .select()
      .eq("id", guildId)
      .single();

    if (result.error || !result.data) {
      throw result.error || new Error("Guild not found");
    }

    return result.data;
  } catch (error) {
    throw new Error(
      `Failed to retrieve guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function updateGuild(
  guildId: string,
  data: GuildUpdate,
): Promise<Guild> {
  if (!guildId) {
    throw new Error("Guild ID is required for updates");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    const result = await supabase
      .from("guilds")
      .update(data)
      .eq("id", guildId)
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error || new Error("Guild not found");
    }

    return result.data;
  } catch (error) {
    throw new Error(
      `Failed to update guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function deleteGuild(guildId: string): Promise<Guild> {
  if (!guildId) {
    throw new Error("Guild ID is required for deletions");
  }

  try {
    const result = await supabase
      .from("guilds")
      .delete()
      .eq("id", guildId)
      .select()
      .single();

    if (result.error || !result.data) {
      throw result.error || new Error("Guild not found");
    }

    return result.data;
  } catch (error) {
    throw new Error(
      `Failed to delete guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
