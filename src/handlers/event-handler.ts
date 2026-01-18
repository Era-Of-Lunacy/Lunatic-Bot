import { Client, type ClientEvents } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: Client, ...args: ClientEvents[K]) => Promise<void> | void;
}

export async function loadEvents(client: Client) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const eventsPath = path.join(__dirname, "../events");

  if (fs.existsSync(eventsPath) && fs.lstatSync(eventsPath).isDirectory()) {
    try {
      const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
        const fileUrl = pathToFileURL(path.join(eventsPath, file)).href;
        const eventModule = await import(fileUrl);
        const event: Event = eventModule.default || eventModule;

        if (!event?.name || typeof event.execute !== "function") {
          console.warn(`Invalid event file: ${file}`);
          continue;
        }

        if (event.once) {
          client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
          client.on(event.name, (...args) => event.execute(client, ...args));
        }
      }

      console.log("Registered events successfully");
    } catch (error) {
      console.error("Error while reading event handler files: ", error);
    }
  } else {
    console.warn("Events folder doesn't exists");
  }
}
