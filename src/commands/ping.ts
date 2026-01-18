import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";
import type { Command } from "@/handlers/command-handler.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's latency"),

  async execute(_: Client, interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  },
};

export default command;
