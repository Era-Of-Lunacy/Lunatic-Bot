import { insertGuild } from "@/db/guilds.js";
import type { Event } from "@/handlers/event-handler.js";

export default {
  name: "guildCreate",
  once: false,
  async execute(_, guild) {
    try {
      insertGuild(guild.id);
    } catch (error) {
      console.error(`Error inserting guild ${guild.id}`);
    }
  },
} as Event<"guildCreate">;
