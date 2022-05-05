import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import playerHasFilters from "../../functions/PlayerHasFilters";
import hasPremium from "../../functions/HasPremium";

export default new Command({
    name: "rotation",
    description: "Enable/disable rotation audio filter",
    aliases: [],
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

        if (player?.filters.active?.rotation) {
            await buildMsg(message, "Disabled rotation filter.");
            player.filters.clear();
        } else {
            // eslint-disable-next-line no-unused-expressions
            playerHasFilters(player!);
            player?.filters.setRotation({ rotationHz: 0.5 }, true);
            await buildMsg(message, "Enabled rotation filter.");
        }
    },
});
