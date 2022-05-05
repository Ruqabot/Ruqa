import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";

export default new Command({
  name: "unloop",
  description: "Disable the loop mode(s)",
  aliases: ["ulp"],
  category: "Music",
  isDisabled: false,

  run: async ({
    message,
    args,
  }: {
    client: Client;
    message: Message;
    args: string[];
  }) => {
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
    const cmdMode = args[0];
    if (!cmdMode) {
      await buildMsg(message, "You need to provide a mode, **track/queue**.");
    } else {
      switch (cmdMode) {
        case "track":
          if (player?.trackRepeat) {
            player?.setTrackLoop(!player.trackRepeat);
            await buildMsg(message, "Disabled **track loop** mode.");
          } else {
            await buildMsg(message, "Track loop mode isn't enabled yet.");
          }
          break;

        case "queue":
          if (player?.queueRepeat) {
            player?.setTrackLoop(!player.queueRepeat);
            await buildMsg(message, "Disabled **queue loop** mode.");
          } else {
            await buildMsg(message, "Queue loop mode isn't enabled yet.");
          }
          break;

        case "all":
          if (player?.trackRepeat || player?.queueRepeat) {
            player.setTrackLoop(false);
            player.setQueueLoop(false);
          } else {
            await buildMsg(message, "There isn't any loop mode(s) active.");
          }
          break;

        default:
          await buildMsg(
            message,
            "Provided mode is invalid, you need to specify **track/queue/all**."
          );
          break;
      }
    }
  },
});
