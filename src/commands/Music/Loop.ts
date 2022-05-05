import type { Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import isPlayerActive from "../../functions/IsPlayerActive";

export default new Command({
    name: "loop",
    description: "Loop the track or the queue",
    aliases: ["lp"],
    category: "Music",
    isDisabled: false,

    run: async ({ message, args }: {
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
        const cmdMode = args[0];
        if (!cmdMode) {
            await buildMsg(message, "You need to provide a mode, **track/queue**.");
        } else {
            switch (cmdMode) {
                case "track":
                    // eslint-disable-next-line no-unused-expressions
                    if (!player?.trackRepeat) {
                        player?.setTrackLoop(!player.trackRepeat);
                        await buildMsg(message, "Enabled **track loop** mode.");
                    } else {
                        player.setTrackLoop(!player.trackRepeat);
                        await buildMsg(message, "Disabled **track loop** mode.");
                    }
                break;

                case "queue":
                    if (!player?.queueRepeat) {
                        player?.setQueueLoop(!player.queueRepeat);
                        await buildMsg(message, "Enabled **queue loop** mode.");
                    } else {
                        player?.setQueueLoop(!player.queueRepeat);
                        await buildMsg(message, "Disabled **queue loop** mode.");
                    }
                break;

                default:
                    await buildMsg(message, "Provided mode is invalid, you need to specify **track/queue**.");
                break;
            }
        }
    },
});
