import { ActivityType, Client } from "discord.js";
import type { Event } from "../handlers/event-handler.js";

export default {
  name: "clientReady",
  once: true,
  async execute(client: Client) {
    console.info(`Logged in as ${client.user?.tag}`);

    client.user?.setActivity({
      name: "Lunatic | /help",
      type: ActivityType.Custom,
    });
  },
} as Event<"clientReady">;
