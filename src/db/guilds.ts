import sql from "@/db/db.js";

export interface Guild {
  id: string;
  moderators: string[];
}

export async function insertGuild(guildId: string): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for insertions");
  }

  try {
    const guilds = (await sql`
      INSERT INTO guilds (id) VALUES (${guildId})
      RETURNING *;
      `) as Guild[];

    return guilds;
  } catch (error) {
    throw new Error(
      `Failed to insert guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function getGuild(guildId: string): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for retrievals");
  }

  try {
    const guilds = (await sql`
      SELECT * FROM guilds WHERE id = ${guildId};
      `) as Guild[];

    return guilds;
  } catch (error) {
    throw new Error(
      `Failed to retrieve guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function updateGuild(
  guildId: string,
  data: Partial<Guild>,
): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for updates");
  }

  try {
    const guilds = (await sql`
        UPDATE guilds SET ${sql(data, [])} WHERE id = ${guildId}
        RETURNING *;
        `) as Guild[];

    return guilds;
  } catch (error) {
    throw new Error(
      `Failed to update guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function deleteGuild(guildId: string): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for deletions");
  }

  try {
    const guilds = (await sql`
      DELETE FROM guilds WHERE id = ${guildId}
      RETURNING *;
      `) as Guild[];

    return guilds;
  } catch (error) {
    throw new Error(
      `Failed to delete guild: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
