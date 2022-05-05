import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import hasPremium from "../../functions/HasPremium";

export default new Command({
    name: "reseteffects",
    description: "Enable/disable nightcore audio filter",
    aliases: ["ref"],
    category: "Filters",
    isDisabled: false,

    run: async ({ message }: {
        client: Client,
        message: Message,
    }) => {
        if (!(await hasPremium(message, message.author.id))) {
            return;
        }
        if (!(await notInVC(message))
        || (!(await notInSameVC(message))
        || (!(await configuredDJRole(message))))) {
            return;
        }

        const [player, ret] = await isPlayerActive(message);
        if (!ret) {
            return;
        }

        player?.filters.clear();
        await buildMsg(message, "Cleared all filters. (if any active)");
    },
});
