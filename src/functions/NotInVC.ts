import type { Message } from "eris";
import buildMsg from "./BuildMsg";

export default async function notInVC(message: Message): Promise<boolean> {
  if (!message.member?.voiceState.channelID) {
    await buildMsg(
      message,
      "You need to be in a voice channel before executing this command."
    );
    return false;
  }
  return true;
}
