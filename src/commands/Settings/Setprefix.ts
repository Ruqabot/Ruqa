import type { Client, Message, TextableChannel } from "eris";
import { env } from "node:process";
import buildMsg from "../../functions/BuildMsg";
import checkPerm from "../../functions/CheckPerm";
import Prefix from "../../models/Prefix";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";

export default new Command({
    name: "setprefix",
    description: "Set a custom prefix for your server",
    aliases: ["sp"],
    category: "Settings",
    isDisabled: false,

    run: async ({ client, message, args }: {
        client: Client,
        message: Message,
        args: string[],
    }) => {
        if (!(await checkPerm(message, "You need **Manage Guild** permission to use this command.", "manageGuild"))) {
            return;
        }
        const prefixCode = args[0];
        if (!prefixCode) {
            await buildMsg(message, "You need to provide a new prefix for this server.");
            return;
        }
        if (prefixCode.length > 3) {
            await buildMsg(message, "Prefix length must be lower than 3 charecters.");
            return;
        }
        Prefix.findOne({
            guildID: message.guildID!,
        }, async (error: unknown) => {
            if (error) {
                const channel = client.getChannel(env.LOGGING_CHANNEL!);
                try {
                    await (channel as TextableChannel)
                    .createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`Something went wrong with the database.\n\n${error}`)] });
                } catch { }
            }

            new Prefix({
                guildID: message.guildID!,
                configuredPrefix: prefixCode,
            }).save();
            await buildMsg(message, `Prefix was been updated to **${prefixCode}**.`);
        });
    },
});
