import type { Client, GuildTextableChannel, Message } from "eris";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";

export default new Command({
  name: "ping",
  description: "Reply with pong",
  aliases: ["pong", "pong"],
  category: "Info",
  isDisabled: false,

  run: async ({
    client,
    message,
  }: {
    client: Client;
    message: Message;
    args: string[];
  }) => {
    const embed = new RichEmbed().setColor(RichEmbed.embedColor)
      .setDescription(`\`\`\`arm\n
Latency : ${client.shards.map((x) => x.latency)} ms
Shard : ${(message.channel as GuildTextableChannel)?.guild.shard.id}\`\`\``);
    return message.channel.createMessage({ embeds: [embed] });
  },
});
