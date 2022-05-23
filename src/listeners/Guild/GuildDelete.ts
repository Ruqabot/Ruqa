import { Guild, type PossiblyUncachedGuild, type TextableChannel } from "eris";
import { env } from "process";
import ruqa from "../..";
import DJRole from "../../models/DJRole";
import Prefix from "../../models/Prefix";
import Event from "../../structures/Event";
import RichEmbed from "../../utils/RichEmbed";
import Emojis from "../../jsons/emojis.json";

export default new Event(
  "guildDelete",
  async (guild: PossiblyUncachedGuild) => {
    const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);

    try {
      if (guild instanceof Guild) {
        await (channel as TextableChannel).createMessage({
          embeds: [
            new RichEmbed()
              .setColor(RichEmbed.embedColor)
              .setDescription(
                `${Emojis[0].outbox_tray} I've left **${guild.name}**, ID: **${guild.id}**`
              ),
          ],
        });
      }
    } catch {}

    Prefix.findOne(
      {
        guildID: guild.id,
      },
      async (
        error: unknown,
        data: { configuredPrefix?: string; delete: () => Promise<void> }
      ) => {
        if (error) {
          const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);
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
        if (data) {
          data.delete();
        }
      }
    );

    DJRole.findOne(
      {
        guildID: guild.id,
      },
      async (
        error: unknown,
        data: {
          configuredRole?: string;
          delete: () => Promise<void>;
        }
      ) => {
        if (error) {
          const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);
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

        if (data) {
          await data.delete();
        }
      }
    );
  }
);
