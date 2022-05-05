import type {
  Message,
  PossiblyUncachedTextableChannel,
  TextableChannel,
} from "eris";
import { env } from "node:process";
import Event from "../../structures/Event";
import client from "../..";
import Prefix from "../../models/Prefix";
import RichEmbed from "../../utils/RichEmbed";

export default new Event(
  "messageCreate",
  async (message: Message<PossiblyUncachedTextableChannel>) => {
    if (message.author.bot || !message.guildID || message.webhookID) return;
    Prefix.findOne(
      {
        guildID: message.guildID!,
      },
      async (error: unknown, data: { configuredPrefix?: string }) => {
        if (error) {
          const channel = client.getChannel(env.LOGGING_CHANNEL!);
          try {
            await (channel as TextableChannel).createMessage({
              embeds: [
                new RichEmbed()
                  .setColor(RichEmbed.embedColor)
                  .setDescription(
                    `Something went wrong with the database.\n\n${error}`
                  ),
              ],
            });
          } catch {}
        }

        const prefix = data?.configuredPrefix ?? env.DEFAULT_PREFIX!;
        if (
          message.content.startsWith(`<@${client.user.id}>`) ||
          message.content.startsWith(`<@!${client.user.id}>`)
        ) {
          const channel = client.getChannel(message.channel.id);
          await (channel as TextableChannel).createMessage({
            embeds: [
              new RichEmbed()
                .setColor(RichEmbed.embedColor)
                .setDescription(`My prefix for this server is **${prefix}**`),
            ],
          });
          return;
        }

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.split(" ");
        const command = args.shift()?.slice(prefix.length);
        if (!command) return;
        const cmd =
          client.commands?.get(command as string) ??
          client.aliases?.get(command as string);

        if ((cmd as { isDisabled?: boolean })?.isDisabled) {
          const channel = client.getChannel(message?.channel?.id);
          await (channel as TextableChannel).createMessage({
            embeds: [
              new RichEmbed()
                .setColor(RichEmbed.embedColor)
                // eslint-disable-next-line no-unsafe-optional-chaining
                .setDescription(
                  `${
                    command?.toString().charAt(0).toUpperCase() +
                    command.slice(1)
                  } command was been disabled globally, for more information please join our [Discord](https://discord.gg/${env.DISCORD_SERVER_INVITE_CODE!}) server.`
                ),
            ],
          });
          return;
        }

        try {
          (cmd as unknown as { run: Function }).run({ client, message, args });
          // eslint-disable-next-line no-empty
        } catch {}
      }
    );
  }
);
