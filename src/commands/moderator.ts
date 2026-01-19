import { getGuild, updateGuild } from "@/db/guilds.js";
import type { Command } from "@/handlers/command-handler.js";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("moderator")
    .setDescription("Manage moderators")
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
    const guild = await getGuild(interaction.guildId!);

    if (
      interaction.user.id !== interaction.guild?.ownerId &&
      !guild[0]?.moderators.includes(interaction.user.id)
    ) {
      await interaction.reply({
        content: "You don't have permission to use this command!",
        ephemeral: true,
      });
      return;
    }

    if (
      guild[0]?.moderators.includes(interaction.options.getUser("user")!.id)
    ) {
      await interaction.reply({
        content: "User is already a moderator!",
        ephemeral: true,
      });
      return;
    }

    try {
      await updateGuild(interaction.guildId!, {
        moderators: [
          ...guild[0]?.moderators!,
          interaction.options.getUser("user")!.id,
        ],
      });
    } catch (error) {
      console.error(`Error updating guild ${interaction.guildId}`);
    }
    await interaction.reply({
      content: "Moderator added successfully!",
      ephemeral: true,
    });
  },
};

export default command;
