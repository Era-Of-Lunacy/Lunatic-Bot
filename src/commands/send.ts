import type { Command } from "@/handlers/command-handler.js";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  TextChannel,
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
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the message to")
            .setRequired(false),
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
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the embed to")
            .setRequired(false),
        );
      return sub;
    }),

  async execute(_: Client, interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "plain") {
      const message = interaction.options.getString("message", true);
      const channel = interaction.options.getChannel("channel", false);

      if (channel) {
        await (channel as TextChannel).send(message);
      } else {
        await interaction.reply(message);
      }
    } else if (subcommand === "embed") {
      const jsonString = interaction.options.getString("json", true);
      const channel = interaction.options.getChannel("channel", false);

      try {
        const json = JSON.parse(jsonString);

        if (json.color && typeof json.color === "string") {
          json.color = parseInt(json.color.replace(/^#/, ""), 16);
        }

        const embed = new EmbedBuilder(json);

        if (channel) {
          await (channel as TextChannel).send({ embeds: [embed] });
        } else {
          await interaction.reply({ embeds: [embed] });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        await interaction.reply({
          content: "Failed to parse JSON. Please check your input.",
          ephemeral: true,
        });
      }
    }
  },
};

export default command;
