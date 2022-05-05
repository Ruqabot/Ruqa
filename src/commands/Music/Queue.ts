import {
    type Client,
    Constants,
    type Message,
    type User,
} from "eris";
import buildMsg from "../../functions/BuildMsg";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInVC from "../../functions/NotInVC";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";
import { queueActiveButtons } from "../../utils/SetButtons";
import { makeChunk } from "../../utils/Util";

export default new Command({
    name: "queue",
    description: "Shows the upcoming queue",
    aliases: ["q"],
    category: "Music",
    isDisabled: false,

    run: async ({ client, message }: {
        client: Client,
        message: Message,
    }) => {
        if (!(await notInVC(message))) {
            return;
        }

        const [player, ret] = await isPlayerActive(message);
        if (!ret) {
            return;
        }
        if (!player!.queue.length) {
            await buildMsg(message, "There are no tracks in the queue.");
            return;
        }
        const mapping = player?.queue.map((t, i) => `\`${++i}.\` [${t.title?.replaceAll("||", "")}](${t.uri}) - [<@!${(t.requester as User).id}>]`);
        const chunk = makeChunk(mapping!, 10);
        client.pages = chunk.map((s) => s.join("\n"));
        client.page = 0;
        if (client.page) client.page -= 1;
        if (client.page > client.pages.length) client.page = 0;
        if (client.page < 0) client.page = 0;

        const embed = new RichEmbed()
        .setDescription(`**Queued Tracks**\n\n${client.pages[client.page]}`)
        .setColor(RichEmbed.embedColor)
        .setFooter(`Page ${client.page + 1}/${client.pages.length}`);
        client.cacheQueueMsg = await message.channel.createMessage({
            embeds: [embed],
            components: [{
                type: Constants.ComponentTypes.ACTION_ROW,
                components: queueActiveButtons,
           }],
       });
    },
});
