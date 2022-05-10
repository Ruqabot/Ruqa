import type { Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";

export default new Command({
  name: "volume",
  description: "Change the volume",
  aliases: ["vol"],
  category: "Music",
  isDisabled: false,

  run: async ({ message, args }: { message: Message; args: string[] }) => {
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
    const vol = args[0];
    if (!vol) {
      await buildMsg(message, "You need to provide a volume level.");
      return;
    }
    if (Number.isNaN(vol)) {
      await buildMsg(message, "Volume must be an integer.");
      return;
    }

    if (Number(vol) > 150 || Number(vol) < 0) {
      await buildMsg(
        message,
        "Volume must be lower than **150%** and higher than **0%**."
      );
      return;
    }
    player?.filters.setVolume(Number(vol));
    await buildMsg(message, `Volume configured to **${player?.volume.toFixed(0)}%**.`);
  },
});
