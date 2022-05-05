import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";

export default new Command({
    name: "remove",
    description: "Remove a track from the queue",
    aliases: ["rm"],
    category: "Music",
    isDisabled: false,

    run: async ({ message, args }: {
        client: Client,
        message: Message,
        args: string[],
    }) => {
        if (!(await notInVC(message))
        || (!(await notInSameVC(message))
        || (!(await configuredDJRole(message))))) {
            return;
        }

        const [player, ret] = await isPlayerActive(message);
        if (!ret) {
            return;
        }
        const trackNumber = args[0];
        if (!trackNumber) {
            await buildMsg(message, "You need to provide a track number.");
        }
        if (Number.isNaN(trackNumber)) {
            await buildMsg(message, "Buddy, track(s) number must be a number.");
            return;
        }
        if (Number(trackNumber) > player!.queue.length
        || Number(trackNumber) < 1) {
            await buildMsg(message, `Buddy, track(s) number must be bigger than **1** and lower than **${player?.queue.length}**.`);
            return;
        }
        player?.queue.slice(0, Number(trackNumber));
    },
});
