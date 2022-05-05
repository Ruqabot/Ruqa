import {
    type Client,
    Constants,
    type Message,
} from "eris";
import { nowplayingModifier, trackStartModifier } from "../../utils/SetButtons";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import Emojis from "../../jsons/emojis.json";
import notInVC from "../../functions/NotInVC";

export default new Command({
    name: "pause",
    description: "Pause the music and I'll wait until someone resume it",
    aliases: ["wait"],
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
        if (player?.paused) {
            await buildMsg(message, "Music is already paused, to resume use the **resume command**.");
        } else {
            player?.pause(true);
            await client.cacheMsgID.edit({
                components: [{
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: trackStartModifier,
                }],
            });
            if (client.cacheNpMsgID) {
                await client.cacheNpMsgID.edit({
                    components: [{
                        type: Constants.ComponentTypes.ACTION_ROW,
                        components: nowplayingModifier,
                    }],
                });
            }
            await message.addReaction(Emojis[0].pause)
        }
    },
});
