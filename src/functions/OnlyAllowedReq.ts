import type { ComponentInteraction, User } from "eris";
import type { Player } from "vulkava";
import RichEmbed from "../utils/RichEmbed";

export default async function onlyAllowedRequester(
  interaction: ComponentInteraction,
  player: Player
): Promise<boolean> {
  if (
    ((player!.current!.requester as User).id as string) !==
    interaction.member?.id
  ) {
    await interaction.createMessage({
      embeds: [
        new RichEmbed()
          .setColor(RichEmbed.embedColor)
          .setDescription("Only requester can use this buttons."),
      ],
      flags: 64,
    });
    return false;
  }
  return true;
}
