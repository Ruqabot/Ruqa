import { Client, Message } from "eris";
import { env } from "node:process";
import Command from "../../structures/Command";
import Emojis from "../../jsons/emojis.json";

export default new Command({
  name: "support",
  description: "Send the support server invite link",
  aliases: ["assistant", "server"],
  category: "Info",
  isDisabled: false,

  run: async ({ client, message }: { client: Client; message: Message }) => {
    await message.channel.createMessage({
      content: `${
        Emojis[0].yellow_heart
      } https://discord.com/api/oauth2/authorize?client_id=${
        client.user.id
      }&permissions=${env.INVITE_PERMISSIONS ?? 0}&scope=bot`,
    });
  },
});
