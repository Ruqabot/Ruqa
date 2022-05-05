import type { TextChannel } from "eris";
import type { Player, Track } from "vulkava";
import ruqa from "../..";
import PlayerEvent from "../../structures/PlayerEvent";
import RichEmbed from "../../utils/RichEmbed";

export default new PlayerEvent("trackStuck", async (player: Player, track: Track) => {
    const channel = ruqa.getChannel(player.textChannelId!) as TextChannel;
    await channel.createMessage({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription(`${track.title} was been stucked, trying to auto skip... (if queue have any tracks)`)] });
    if (player.queue.length > 0) {
        player.skip();
    }
});
