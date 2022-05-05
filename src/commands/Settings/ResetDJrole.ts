import type { Client, Message, TextableChannel } from "eris";
import { env } from "node:process";
import buildMsg from "../../functions/BuildMsg";
import checkPerm from "../../functions/CheckPerm";
import DJRole from "../../models/DJRole";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";

export default new Command({
    name: "resetdjrole",
    description: "Reset the DJ role",
    aliases: ["rdj", "nodj"],
    category: "Settings",
    isDisabled: false,

    run: async ({ client, message}: {
        client: Client,
        message: Message,
    }) => {
        if (!(await checkPerm(message, "You need **Manage Guild** permission to use this command.", "manageGuild"))) {
            return;
        }
        DJRole.findOne({
            guildID: message.guildID!,
        }, async (error: unknown, data: {
            configuredRole?: string,
            delete: () => Promise<void>,
        }) => {
            if (error) {
                const channel = client.getChannel(env.LOGGING_CHANNEL!);
                try {
                    await (channel as TextableChannel)
                    .createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`Something went wrong with the database.\n\n${error}`)] });
                } catch { }
            }

            if (data) {
                await data.delete();
                await buildMsg(message, "DJ role was been reset.");
            } else {
                await buildMsg(message, "No DJ role was configured for this server.");
            }
        });
    },
});
