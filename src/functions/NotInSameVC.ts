import type { Message } from "eris";
import ruqa from "..";
import buildMsg from "./BuildMsg";

export default async function notInSameVC(message: Message): Promise<boolean> {
    const restMember = await ruqa.getRESTGuildMember(
        message.guildID!,
        ruqa.user.id,
    );
    if (restMember.voiceState.channelID) {
        if (restMember.voiceState.channelID !== message.member?.voiceState.channelID) {
            await buildMsg(message, `You need to join <#${restMember.voiceState.channelID}> channel to use this command buddy.`);
            return false;
        }
    }
    return true;
}
