import {
    type Client,
    Constants,
    type Message,
    type User,
} from "eris";
import prettyMs from "pretty-ms";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInVC from "../../functions/NotInVC";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";
import { nowplayingButtons, nowplayingModifier } from "../../utils/SetButtons";
import { buildProgressBar } from "../../utils/Util";

export default new Command({
    name: "nowplaying",
    description: "Shows what's now playing",
    aliases: ["np"],
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
        const track = player?.current;
        const [bar, percentage] = buildProgressBar(
            track?.isStream ? 1 : track?.duration,
            track?.isStream ? 1 : player?.position,
        );

        const embed = new RichEmbed()
        .setColor(RichEmbed.embedColor)
        .setAuthor(player?.current?.title ?? "Unknown title", player?.current?.uri)
        .setThumbnail(
            player?.current?.identifier
            ? `https://img.youtube.com/vi/${player?.current?.identifier}/default.jpg`
            : "",
        )
        .setDescription(`\n\n**Author**: ${player?.current?.author}\n**Requester**: <@!${(player?.current?.requester as User).id}>\n**Duration**: ${player?.current?.isStream ? "Stream" : prettyMs(Number(player?.current?.duration), { verbose: true })}`)
        .addField(
            "Upcoming",
            player?.queue[0]
            ? `[${player.queue[0].title}](${player.queue[0].uri})`
            : "There are no upcoming track(s) in the queue",
        )
        .addField("Progress", `${bar}\n`
            + `${player?.current?.isStream ? "Stream" : `${prettyMs(Number(player?.exactPosition), { verbose: true })} (${Number(percentage).toFixed(2)}%)`}`);

        if (client.cacheNpMsgID) {
            client.cacheNpMsgID.delete();
        }
        client.cacheNpMsgID = await message.channel.createMessage({
            embeds: [embed],
            components: [{
                type: Constants.ComponentTypes.ACTION_ROW,
                components: player?.paused
                ? nowplayingModifier
                : nowplayingButtons,
            }],
        });
    },
});
