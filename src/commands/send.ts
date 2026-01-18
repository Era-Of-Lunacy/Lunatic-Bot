import type { Command } from "@/handlers/command-handler.js";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send a message")
    .addSubcommand((sub) => {
      sub
        .setName("plain")
        .setDescription("Send a plain message")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to send")
            .setRequired(true),
        );
      return sub;
    })
    .addSubcommand((sub) => {
      sub
        .setName("embed")
        .setDescription("Send an embed message")
        .addStringOption((option) =>
          option
            .setName("json")
            .setDescription(
              "The JSON of the embed (more info: https://embed.dan.onl/)",
            )
            .setRequired(true),
        );
      return sub;
    }),

  async execute(_: Client, interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "plain") {
      const message = interaction.options.getString("message", true);
      await interaction.reply(message);
    } else if (subcommand === "embed") {
      const jsonString = interaction.options.getString("json", true);

      try {
        const embedData = JSON.parse(jsonString);
        await interaction.reply({ embeds: [embedData] });
      } catch (error) {
        await interaction.reply({
          content: "Failed to parse JSON. Please check your input.",
          ephemeral: true,
        });
      }
    }
  },
};

export default command;
