import type { Message } from "eris";
import type { Player } from "vulkava";
import ruqa from "..";
import RichEmbed from "../utils/RichEmbed";

export default async function isPlayerActive(
  message: Message
): Promise<[Player | undefined, boolean]> {
  const audio = ruqa.audio.players?.get(message.guildID!);
  if (!audio || !audio?.current) {
    await message.channel.createMessage({
      embeds: [
        new RichEmbed()
          .setColor(RichEmbed.embedColor)
          .setDescription("I'm nothing playing right now."),
      ],
    });
    return [audio, false];
  }
  return [audio, true];
}
