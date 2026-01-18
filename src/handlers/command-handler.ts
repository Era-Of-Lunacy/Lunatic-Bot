import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Client,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (
    client: Client,
    interaction: ChatInputCommandInteraction,
  ) => Promise<void> | void;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;
}
export async function registerCommands(client: Client) {
  (client as any).commands = new Collection();

  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const commandsPath = path.join(__dirname, "../commands");

  if (fs.existsSync(commandsPath) && fs.lstatSync(commandsPath).isDirectory()) {
    try {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const fileUrl = pathToFileURL(path.join(commandsPath, file)).href;
        const commandModule = await import(fileUrl);
        const command: Command = commandModule.default || commandModule;

        if (!command?.data || typeof command.execute !== "function") {
          console.warn(`Invalid command file: ${file}`);
          continue;
        }

        commands.push(command.data.toJSON());
        (client as any).commands.set(command.data.name, command);
      }

      const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
        {
          body: commands,
        },
      );

      console.log("Registered commands successfully!");
    } catch (error) {
      console.error("Failed to register commands: ", error);
    }
  } else {
    console.warn("Commands folder doesn't exists");
  }
}
