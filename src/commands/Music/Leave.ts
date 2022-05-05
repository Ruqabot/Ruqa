import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import Emojis from "../../jsons/emojis.json";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";

export default new Command({
  name: "leave",
  description: "Leave the voice channel where bot is already connected",
  aliases: ["lea"],
  category: "Music",
  isDisabled: false,

  run: async ({ client, message }: { client: Client; message: Message }) => {
    if (
      !(await notInVC(message)) ||
      !(await notInSameVC(message)) ||
      !(await configuredDJRole(message))
    ) {
      return;
    }
    const player = client.audio.players.get(message.guildID!);
    if (!player) {
      await buildMsg(message, "I'm not connected to any voice channel yet.");
    } else {
      player?.destroy();
      player?.disconnect();
      await message.addReaction(Emojis[0].wave);
    }
  },
});
