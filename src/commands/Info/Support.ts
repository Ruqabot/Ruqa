import { Message } from "eris";
import { env } from "node:process";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";

export default new Command({
  name: "support",
  description: "Send the support server invite link",
  aliases: ["assistant", "server"],
  category: "Info",
  isDisabled: false,

  run: async ({ message }: { message: Message }) => {
    const embed = new RichEmbed()
      .addField(
        "Support Server",
        `[Invite](https://discord.gg/${env.SUPPORT_SERVER ?? "not_set"})`
      )
      .addField(
        "Friends Server",
        `[Invite](https://discord.gg/${env.FRIENDS_SERVER ?? "not_set"})`
      );
    await message.channel.createMessage({ embeds: [embed] });
  },
});
