import { promises } from "node:fs";
import { resolve } from "node:path";
import { env } from "node:process";
import { Client, type Message } from "eris";
import { Vulkava } from "vulkava";
import { connect } from "mongoose";
import { config } from "dotenv";
import Logger from "../utils/Logger";
import WSEvents from "../options/WebsocketEvents";
import lavanodes from "../jsons/nodes.json";
import spotifyCredential from "../jsons/spotify.json";
import "../utils/NodeErrors";

config({ path: resolve(".", ".env") });

export default class Ruqa extends Client {
  public commands?: Map<string, unknown>;

  public aliases?: Map<string, unknown>;

  public constructor() {
    super(env.DEVMODE === "true" ? env.DEVTOKEN! : env.TOKEN!, {
      intents: [
        "guilds",
        "guildMessages",
        "guildVoiceStates",
        "messageContent",
      ],
      restMode: true,
      defaultImageSize: 512,
      disableEvents: WSEvents,
      maxShards: "auto",
      messageLimit: 0,
    });

    this.commands = new Map<string, unknown>();
    this.aliases = new Map<string, unknown>();
  }

  public async connectWithGateway(): Promise<void> {
    super.connect();
    await this.loadCommands();
    await this.loadGuildEvents();
    await this.loadVulkava();
    await this.loadLavalinkEvents();
    if (env.MONGO_MUST_CONNECT === "true") {
      await this.linkMongoDB();
    }
  }

  private async loadCommands(): Promise<this | undefined> {
    const directories = await promises.readdir(resolve("dist", "commands"), {
      withFileTypes: true,
    });
    for (const directory of directories) {
      if (!directory.isDirectory) {
        return;
      }
      const commands = await promises.readdir(
        resolve("dist", `commands/${directory.name}`),
        { withFileTypes: true }
      );
      for (const command of commands) {
        if (!command.isFile()) {
          return;
        }
        const cmd = (
          await import(
            resolve("dist", `commands/${directory.name}/${command.name}`)
          )
        ).default;
        this.commands?.set(cmd.name, cmd);
        cmd.aliases?.forEach((e: string) => {
          this.aliases?.set(e, cmd);
        });
      }
    }
  }

  private async loadGuildEvents(): Promise<void> {
    const discordEvents = await promises.readdir(
      resolve("dist", "listeners", "Guild")
    );
    for (const event of discordEvents) {
      const eventCmd = (
        await import(resolve("dist", `listeners/Guild/${event}`))
      ).default;
      this.on(eventCmd.event, eventCmd.run);
    }
  }

  private async loadVulkava(): Promise<void> {
    this.audio = new Vulkava({
      nodes: lavanodes,
      spotify: spotifyCredential,
      sendWS: (guildID, payload) => {
        this.guilds.get(guildID)?.shard.sendWS(payload.op, payload.d);
      },
    });
  }

  private async loadLavalinkEvents(): Promise<void> {
    const discordEvents = await promises.readdir(
      resolve("dist", "listeners", "Lavalink")
    );
    for (const event of discordEvents) {
      const eventCmd = (
        await import(resolve("dist", `listeners/Lavalink/${event}`))
      ).default;
      this.audio.on(eventCmd.event, eventCmd.run);
    }
  }

  private async linkMongoDB(): Promise<void> {
    await connect(env.MONGODB_URI!)
      .then(() => Logger.success("Connected with mongodb."))
      .catch((e) =>
        Logger.error(
          `An error occurred while establishing connection with mongodb.\nError:\n${e}`
        )
      );
  }
}

declare module "eris" {
  export interface Client {
    audio: Vulkava;
    cacheMsgID: Message;
    cacheNpMsgID: Message;
    cacheQueueMsg: Message;
    page: number;
    pages: string[];
  }
}
