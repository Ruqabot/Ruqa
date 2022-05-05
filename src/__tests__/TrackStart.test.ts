/**
 * @ignore This is a test file, you can safely ignore it.
 */

import type { TextChannel } from "eris";
import ruqa from "../index";
import PlayerEvent from "../structures/PlayerEvent";
import RichEmbed from "../utils/RichEmbed";
import Emojis from "../jsons/emojis.json";

export default new PlayerEvent("trackStart", async (player) => {
    const channel = ruqa.getChannel(player.textChannelId as string) as TextChannel;
    const embed = new RichEmbed()
    .setColor(RichEmbed.embedColor)
    .setDescription(`${Emojis[0].audio} [${player.current?.title as string}](${player.current?.uri})`)
    .setThumbnail(`https://i.ytimg.com/vi/${player.current?.identifier}/mqdefault.jpg`);
    await channel.createMessage({ embeds: [embed] })
    .catch(() => { });
});
