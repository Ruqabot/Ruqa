import { ComponentInteraction, Message } from "eris";
import RichEmbed from "../utils/RichEmbed";
import buildMsg from "./BuildMsg";

export default async function notInVC(
  message: Message | ComponentInteraction
): Promise<boolean> {
  if (!message.member?.voiceState.channelID) {
    if (message instanceof Message) {
      await buildMsg(
        message,
        "You need to be in a voice channel before executing this command."
      );
    } else {
      await message.createMessage({
        embeds: [
          new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setDescription(
              "You need to be in a voice channel before executing this command."
            ),
        ],
        flags: 64,
      });
    }
    return false;
  }
  return true;
}
