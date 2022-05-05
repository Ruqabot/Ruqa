import type { Client, Message } from "eris";
import Command from "../../structures/Command"
import RichEmbed from "../../utils/RichEmbed";
import buildMsg from "../../functions/BuildMsg";
import notInVC from "../../functions/NotInVC";
import notInSameVC from "../../functions/NotInSameVC";
import Emojis from "../../jsons/emojis.json";

export default new Command({
    name: "play",
    description: "Play music on voice channel",
    aliases: ["p"],
    category: "Music",
    isDisabled: false,

    run: async ({ client, message, args }: {
        client: Client,
        message: Message,
        args: string[],
    }) => {
        if (!(await notInVC(message))
        || (!(await notInSameVC(message)))) {
            return;
        }
        const query = args.join(" ");
        let msg: Message;
        if (!query) {
            await buildMsg(message, "You need to provide a query, buddy.");
            return;
        }
        const res = await client.audio.search(query as string);

        const player = client.audio.createPlayer({
            guildId: message.guildID!,
            textChannelId: message.channel.id,
            voiceChannelId: message.member?.voiceState.channelID,
            selfDeaf: true,
        });

        player.connect();

        switch (res.loadType) {
            case "LOAD_FAILED":
                await buildMsg(message, "Something broke while loading the track/playlist.");
            break;

            case "NO_MATCHES":
                await buildMsg(message, "There are no matches found about your query.");
            break;

            case "PLAYLIST_LOADED":
                msg = await message.channel.createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`${Emojis[0].audio} Loading playlist ${res.playlistInfo?.name?.replaceAll("||", "")}`)] });
                res.tracks.forEach((track) => {
                    track.setRequester(message.author);
                    player.queue.push(track);
                });
                await msg.edit({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`${Emojis[0].audio} Added ${res.playlistInfo?.name?.replaceAll("||", "")}`)] })
                .catch(() => { });
            break;

            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                res.tracks[0].setRequester(message.author);
                player.queue.push(res.tracks[0]);
                await buildMsg(message, `${Emojis[0].audio} Added ${res.tracks[0]?.title?.replaceAll("||", "")}`);
            break;
        }

        if (!player.playing) {
            await player.play();
        }
    },
});
