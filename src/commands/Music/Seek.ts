import type { Client, Message } from "eris";
import ms from "ms";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";

export default new Command({
  name: "seek",
  description: "Seek a track to a specific time",
  aliases: ["time"],
  category: "Music",
  isDisabled: false,

  run: async ({
    client,
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
    if (!player?.current?.isSeekable) {
      await buildMsg(message, "Current track is LIVE, you can't seek it.");
      return;
    }
    const argTime = args[0];
    if (!argTime) {
      await buildMsg(message, "You need to provide a time.");
      return;
    }
    const time = ms(args[0]);
    if (!time) {
      await buildMsg(message, "You need to provide a valid time to seek.");
      return;
    }
    if (!player.playing || player.paused) {
      await buildMsg(
        message,
        "Current track is either paused or not stucked, can't seek."
      );
      return;
    }
    if (time < 1 || time > player.current.duration) {
      await buildMsg(
        message,
        `Seek time must be bigger than **1 sec** and must be smaller than **${ms(
          player.current.duration,
          { long: true }
        )}**.`
      );
      return;
    }
    if (typeof time === "undefined") {
      await buildMsg(
        message,
        "Uhhh, most likely an error occurred to seek, can you try something else, like different time format?"
      );
      return;
    }
    player.seek(time);
    await buildMsg(message, `Seeked to **${ms(time, { long: true })}**.`);
  },
});
