import sql from "@/db/db.js";

export interface Guild {
  id: string;
  moderators: string[];
}

export async function insertGuild(guildId: string): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for insertions");
  }

  const guilds = (await sql`
    INSERT INTO guilds (id) VALUES (${guildId})
    RETURNING *;
    `) as Guild[];

  return guilds;
}

export async function getGuild(guildId: string): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for retrievals");
  }

  const guilds = (await sql`
    SELECT * FROM guilds WHERE id = ${guildId};
    `) as Guild[];

  return guilds;
}

export async function updateGuild(
  guildId: string,
  data: Partial<Guild>,
): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for updates");
  }

  const guilds = (await sql`
        UPDATE guilds SET ${sql(data, [])} WHERE id = ${guildId}
        RETURNING *;
        `) as Guild[];

  return guilds;
}

export async function deleteGuild(guildId: string): Promise<Guild[]> {
  if (!guildId) {
    throw new Error("Guild ID is required for deletions");
  }

  const guilds = (await sql`
    DELETE FROM guilds WHERE id = ${guildId}
    RETURNING *;
    `) as Guild[];

  return guilds;
}
