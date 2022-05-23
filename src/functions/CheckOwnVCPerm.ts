import { type Message, Constants, type TextChannel } from "eris";
import ruqa from "..";
import permKeys from "../utils/PermKeys";
import buildMsg from "./BuildMsg";

export default async function checkOwnPerm(
  message: Message,
  perm: keyof Constants["Permissions"],
  desc?: string
): Promise<boolean> {
  if (
    !(ruqa.getChannel(message.member?.voiceState.channelID!) as TextChannel)
      .permissionsOf(ruqa.user.id)
      .has(perm)
  ) {
    await buildMsg(
      message,
      desc ??
        `I don't have **${permKeys(perm)}** permission in <#${
          message.member?.voiceState.channelID
        }>.`
    );
    return false;
  }
  return true;
}
