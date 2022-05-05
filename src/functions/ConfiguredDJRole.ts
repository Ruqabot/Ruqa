import type { Message } from "eris";
import DJRole from "../models/DJRole";
import RichEmbed from "../utils/RichEmbed";

export default async function configuredDJRole(
    message: Message,
): Promise<boolean> {
    const data = await DJRole.findOne({ guildID: message.guildID! });

    if (data) {
        if (data?.configuredRole) {
            if (!message.member?.roles.find((x) => x === data?.configuredRole)) {
                await message.channel.createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription("You don't have the DJ role to use this command.")], flags: 64 })
                return false;
            }
        }
    }
    return true;
}
