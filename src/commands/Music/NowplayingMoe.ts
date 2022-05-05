import type { Client, Message } from "eris";
import buildMsg from "../../functions/BuildMsg";
import ListenmoeWS from "../../libs/ListenmoeWS";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";

export default new Command({
    name: "nowplayingmoe",
    description: "Shows what's now playing from listen.moe",
    aliases: ["nmoe", "nowmoe"],
    category: "Music",
    isDisabled: false,

    run: async ({ message, args }: {
        client: Client,
        message: Message,
        args: string[],
    }) => {
        const genre = args[0];
        if (!genre) {
            await buildMsg(message, "You need to specify a genre.");
            return;
        }
        if (!(["jpop", "kpop"].includes(genre))) {
            await buildMsg(message, "You need to specify a genre either **jpop** or **kpop**.");
            return;
        }
        if (genre === "jpop") {
            const embed = new RichEmbed()
            .setTitle((await ListenmoeWS.jpop).data?.title?.toString()!)
            .setDescription(`Source: ${(await ListenmoeWS.jpop).data?.source ?? "Unknown"}\nOverall Listeners: ${(await ListenmoeWS.jpop).data?.listeners}`)
            .setColor(RichEmbed.embedColor)
            .setImage((await ListenmoeWS.jpop).data?.cover!)
            .addField("Artists", (await ListenmoeWS.jpop).data?.artists as string);
            await message.channel.createMessage({ embeds: [embed] });
        } else {
            const embed = new RichEmbed()
            .setTitle((await ListenmoeWS.kpop).data?.title?.toString()!)
            .setDescription(`Source: ${(await ListenmoeWS.jpop).data?.source ?? "Unknown"}\nOverall Listeners: ${(await ListenmoeWS.jpop).data?.listeners}`)
            .setColor(RichEmbed.embedColor)
            .setImage((await ListenmoeWS.jpop).data?.cover!)
            .addField("Artists", (await ListenmoeWS.jpop).data?.artists as string);
            await message.channel.createMessage({ embeds: [embed] });
        }
    },
});
