import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { registerCommands } from "@/handlers/command-handler.js";

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
  console.warn("Please set required environment variables");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.login(process.env.DISCORD_TOKEN);

await registerCommands(client);
