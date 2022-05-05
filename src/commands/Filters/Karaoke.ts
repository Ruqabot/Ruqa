import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import playerHasFilters from "../../functions/PlayerHasFilters";
import hasPremium from "../../functions/HasPremium";

export default new Command({
  name: "karaoke",
  description: "Enable/disable karaoke audio filter",
  aliases: [],
  category: "Filters",
  isDisabled: false,

  run: async ({ message }: { client: Client; message: Message }) => {
    if (!(await hasPremium(message, message.author.id))) {
      return;
    }
    if (
      !(await notInVC(message)) ||
      !(await notInSameVC(message)) ||
      !(await configuredDJRole(message))
    ) {
      return;
    }

    const [player, ret] = await isPlayerActive(message);
    if (!ret) {
      return;
    }

    if (player?.filters.active?.karaoke) {
      player.filters.clear();
      await buildMsg(message, "Disabled karaoke filter.");
    } else {
      // eslint-disable-next-line no-unused-expressions
      playerHasFilters(player!);
      player?.filters.setKaraoke(
        {
          level: 1.0,
          monoLevel: 1.0,
          filterBand: 220.0,
          filterWidth: 100.0,
        },
        true
      );
      await buildMsg(message, "Enabled karaoke filter.");
    }
  },
});
