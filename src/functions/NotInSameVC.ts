import { type ComponentInteraction, Message } from "eris";
import ruqa from "..";
import RichEmbed from "../utils/RichEmbed";
import buildMsg from "./BuildMsg";

export default async function notInSameVC(
  message: Message | ComponentInteraction
): Promise<boolean> {
  const restMember = await ruqa.getRESTGuildMember(
    message.guildID!,
    ruqa.user.id
  );
  if (restMember.voiceState.channelID) {
    if (
      restMember.voiceState.channelID !== message.member?.voiceState.channelID
    ) {
      if (message instanceof Message) {
        await buildMsg(
          message,
          `You need to join <#${restMember.voiceState.channelID}> channel to use this command buddy.`
        );
      } else {
        await message.createMessage({
          embeds: [
            new RichEmbed()
              .setColor(RichEmbed.embedColor)
              .setDescription(
                `You need to join <#${restMember.voiceState.channelID}> channel to use this command buddy.`
              ),
          ],
          flags: 64,
        });
      }
      return false;
    }
  }
  return true;
}
