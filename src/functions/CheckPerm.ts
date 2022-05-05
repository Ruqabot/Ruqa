import { type Message, Constants } from "eris";
import buildMsg from "./BuildMsg";

export default async function checkPerm(
    message: Message,
    desc: string,
    perm: keyof Constants["Permissions"],
): Promise<boolean> {
    if (!message.member?.permissions.has(perm)) {
        await buildMsg(message, desc);
        return false;
    }
    return true;
}
