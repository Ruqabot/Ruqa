import type { Message } from "eris";
import { env } from "node:process";
import buildMsg from "./BuildMsg";
import Emojis from "../jsons/emojis.json";
import ruqa from ".."

export default async function hasPremium(
    message: Message,
    memberID: string,
): Promise<boolean> {
    if (!env.BOT_SUPPORT_GUILD_ID) {
        throw new Error("Bot support server id wasn't configured in .env file.");
    }
    const member = await ruqa.getRESTGuildMember(env.BOT_SUPPORT_GUILD_ID!, memberID);
    if (!env.PREMIUM_ROLEID) {
        throw new Error("Premium role id wasn't configured in .env file.");
    }
    if (!member.roles.find((x) => x === env.PREMIUM_ROLEID)) {
        await buildMsg(message, `${Emojis[0].star} This command is only for premium members, it only $0.5 / month, for more information please join our [Discord](https://discord.gg/${env.SUPPORT_SERVER ?? "not_set"}) server.`);
        return false;
    }
    return true;
}
