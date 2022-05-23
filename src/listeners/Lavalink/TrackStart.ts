import { Constants, type TextChannel } from "eris";
import type { Player } from "vulkava";
import ruqa from "../../index";
import PlayerEvent from "../../structures/PlayerEvent";
import RichEmbed from "../../utils/RichEmbed";
import Emojis from "../../jsons/emojis.json";
import { trackStartButtons } from "../../utils/SetButtons";

export default new PlayerEvent("trackStart", async (player: Player) => {
  const channel = ruqa.getChannel(player.textChannelId!) as TextChannel;
  const embed = new RichEmbed()
    .setColor(RichEmbed.embedColor)
    .setTitle("Now playing")
    .setDescription(
      `${Emojis[0].audio} [${player.current?.title as string}](${
        player.current?.uri
      })`
    )
    .setThumbnail(
      `https://i.ytimg.com/vi/${player.current?.identifier}/mqdefault.jpg`
    );
  // eslint-disable-next-line prefer-const
  ruqa.cacheMsgID = await channel.createMessage({
    embeds: [embed],
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: trackStartButtons,
      },
    ],
  });
});
