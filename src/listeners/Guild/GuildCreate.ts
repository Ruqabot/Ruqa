import type { Guild, TextableChannel } from "eris";
import { env } from "node:process";
import Event from "../../structures/Event";
import ruqa from "../..";
import RichEmbed from "../../utils/RichEmbed";
import Emojis from "../../jsons/emojis.json";

export default new Event("guildCreate", async (guild: Guild) => {
  try {
    const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);
    await (channel as TextableChannel).createMessage({
      embeds: [
        new RichEmbed()
          .setColor(RichEmbed.embedColor)
          .setDescription(
            `${Emojis[0].inbox_tray} I've joined **${guild.name}**, ID: **${guild.id}**`
          ),
      ],
    });
  } catch {}
});
