import type { TextableChannel } from "eris";
import { env } from "node:process";
import Event from "../../structures/Event";
import ruqa from "../../index"
import RichEmbed from "../../utils/RichEmbed";

export default new Event("error", async (error: Error) => {
    const channel = ruqa.getChannel(env.LOGGING_CHANNEL!);
    try {
        await (channel as TextableChannel)
        .createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`Something went wrong with the connection.\n\n${error?.message ?? "Error occurred but no message found."}`)] });
    } catch { }
});
