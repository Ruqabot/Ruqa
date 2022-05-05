import type { PossiblyUncachedGuild, TextableChannel } from "eris";
import { env } from "process";
import ruqa from "../..";
import DJRole from "../../models/DJRole";
import Prefix from "../../models/Prefix";
import Event from "../../structures/Event";
import RichEmbed from "../../utils/RichEmbed";

export default new Event("guildDelete", async (guild: PossiblyUncachedGuild) => {
    Prefix.findOne({
        guildID: guild.id,
    }, async (error: unknown, data: { configuredPrefix?: string, delete: () => Promise<void> }) => {
        if (error) {
            const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);
            try {
                await (channel as TextableChannel)
                .createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`Something went wrong with the database.\n\n${error}`)] });
            } catch { }
        }
        if (data) {
            data.delete();
        }
    });

    DJRole.findOne({
        guildID: guild.id,
    }, async (error: unknown, data: {
        configuredRole?: string,
        delete: () => Promise<void>,
    }) => {
        if (error) {
            const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);
            try {
                await (channel as TextableChannel)
                .createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`Something went wrong with the database.\n\n${error}`)] });
            } catch { }
        }

        if (data) {
            await data.delete();
        }
    });
});
