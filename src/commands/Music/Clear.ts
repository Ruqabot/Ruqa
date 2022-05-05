import type { Client, Message } from "eris";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import Command from "../../structures/Command";

export default new Command({
    name: "clear",
    description: "Clear the whole queue",
    aliases: ["clr"],
    category: "Music",
    isDisabled: false,

    run: async ({ message }: {
        client: Client,
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

        if (!player?.queue.length) {
            await buildMsg(message, "Queue must have more than **1 track**, currently queue is empty.");
            return;
        }
        const cacheSize = player?.queue.length;
        player?.queue.slice(0, 0);
        await buildMsg(message, `Removed **${cacheSize}** tracks from the queue.`);
    },
});
