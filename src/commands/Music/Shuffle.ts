import type { Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";

export default new Command({
    name: "shuffle",
    description: "Shuffle the queue",
    aliases: ["mix"],
    category: "Music",
    isDisabled: false,

    run: async ({ message }: {
        message: Message,
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
        if (player!.queue.length < 4) {
            await buildMsg(message, "There must be more than **4 tracks** to shuffle them.");
            return;
        }
        player?.shuffleQueue();
        await buildMsg(message, `Shuffled **${player?.queue.length} tracks**.`);
    },
});
