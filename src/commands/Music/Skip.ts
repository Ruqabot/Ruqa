import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import Emojis from "../../jsons/emojis.json";

export default new Command({
    name: "skip",
    description: "Skip the current track",
    aliases: ["sk"],
    category: "Music",
    isDisabled: false,

    run: async ({ client, message }: {
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
        player?.skip();
        client.audio.emit("trackEnd", () => { });
        await message.addReaction(Emojis[0].ok_hand);
    },
});
