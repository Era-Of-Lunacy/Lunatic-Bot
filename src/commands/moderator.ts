import { getGuild, updateGuild } from "@/db/guilds.js";
import type { Command } from "@/handlers/command-handler.js";
import { MessageFlags, SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("moderator")
    .setDescription("Manage moderators")
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all moderators"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a moderator")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add as a moderator")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a moderator")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove as a moderator")
            .setRequired(true),
        ),
    ),
  execute: async (_, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const subcommand = interaction.options.getSubcommand();

    const guild = await getGuild(interaction.guildId!);

    if (
      interaction.user.id !== interaction.guild?.ownerId &&
      !guild.moderators.includes(interaction.user.id)
    ) {
      await interaction.reply({
        content: "You don't have permission to use this command!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (subcommand === "list") {
      await interaction.reply({
        content: guild.moderators.join("\n"),
        flags: MessageFlags.Ephemeral,
      });
      return;
    } else if (subcommand === "add") {
      if (guild.moderators.includes(interaction.options.getUser("user")!.id)) {
        await interaction.reply({
          content: "User is already a moderator!",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await updateGuild(interaction.guildId!, {
        moderators: [
          ...guild.moderators,
          interaction.options.getUser("user")!.id,
        ],
      });

      await interaction.reply({
        content: "Moderator added successfully!",
        flags: MessageFlags.Ephemeral,
      });
    } else if (subcommand === "remove") {
      if (!guild.moderators.includes(interaction.options.getUser("user")!.id)) {
        await interaction.reply({
          content: "User not found in moderators!",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await updateGuild(interaction.guildId!, {
        moderators: guild.moderators.filter(
          (mod) => mod !== interaction.options.getUser("user")!.id,
        ),
      });

      await interaction.reply({
        content: "Moderator removed successfully!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default command;
