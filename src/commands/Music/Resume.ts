import { type Client, Constants, type Message } from "eris";
import { nowplayingButtons, trackStartButtons } from "../../utils/SetButtons";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInVC from "../../functions/NotInVC";
import notInSameVC from "../../functions/NotInSameVC";
import Emojis from "../../jsons/emojis.json";

export default new Command({
  name: "resume",
  description: "Resume a paused track",
  aliases: ["continue"],
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
    const [player, ret] = await isPlayerActive(message);
    if (!ret) {
      return;
    }
    if (player?.paused) {
      player?.pause(false);
      await client.cacheMsgID.edit({
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: trackStartButtons,
          },
        ],
      });
      if (client.cacheNpMsgID) {
        await client.cacheNpMsgID.edit({
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: nowplayingButtons,
            },
          ],
        });
      }
      await message.addReaction(Emojis[0].resume);
    } else {
      await buildMsg(
        message,
        "Music is not paused yet, to pause use the **pause command**."
      );
    }
  },
});
