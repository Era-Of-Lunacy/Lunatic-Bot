import { insertGuild } from "@/db/guilds.js";
import type { Event } from "@/handlers/event-handler.js";

export default {
  name: "guildCreate",
  once: false,
  async execute(_, guild) {
    insertGuild(guild.id);
  },
} as Event<"guildCreate">;
