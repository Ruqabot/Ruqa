import type { Message, TextableChannel } from "eris";
import RichEmbed from "../utils/RichEmbed";

export default async function buildMsg(
  message: Message<TextableChannel>,
  desc: string
): Promise<void> {
  message.channel.createMessage({
    embeds: [
      new RichEmbed().setColor(RichEmbed.embedColor).setDescription(desc),
    ],
  });
}
