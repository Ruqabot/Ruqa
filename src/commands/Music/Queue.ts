import {
  ComponentInteraction,
  Constants,
  type Message,
  type Interaction,
  type User,
} from "eris";
import prettyMs from "pretty-ms";
import {
  nowplayingButtons,
  nowplayingModifier,
  trackStartButtons,
  trackStartModifier,
} from "../../utils/SetButtons";
import Event from "../../structures/Event";
import ruqa from "../../index";
import RichEmbed from "../../utils/RichEmbed";
import { buildProgressBar } from "../../utils/Util";
import onlyAllowedRequester from "../../functions/OnlyAllowedReq";

export default new Event(
  "interactionCreate",
  async (interaction: Interaction) => {
    await (interaction as ComponentInteraction).acknowledge().catch(() => {});

    if (interaction instanceof ComponentInteraction) {
      const player = ruqa.audio.players.get(interaction.guildID!);
      let msg: Message;
      switch (interaction.data.custom_id) {
        case "pauseOrResume":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          if (player?.paused) {
            player?.pause(false);
            msg = await ruqa.getMessage(
              interaction.channel.id,
              interaction.message.id
            );
            await msg.edit({
              components: [
                {
                  type: Constants.ComponentTypes.ACTION_ROW,
                  components: trackStartButtons,
                },
              ],
            });
            if (ruqa.cacheNpMsgID) {
              ruqa.cacheNpMsgID.edit({
                components: [
                  {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: nowplayingButtons,
                  },
                ],
              });
            }
          } else {
            player?.pause(true);
            msg = await ruqa.getMessage(
              interaction.channel.id,
              interaction.message.id
            );
            msg.edit({
              components: [
                {
                  type: Constants.ComponentTypes.ACTION_ROW,
                  components: trackStartModifier,
                },
              ],
            });
            if (ruqa.cacheNpMsgID) {
              ruqa.cacheNpMsgID.edit({
                components: [
                  {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: nowplayingModifier,
                  },
                ],
              });
            }
          }
          break;

        case "skip":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          if (player!.queue.length < 1) {
            await interaction.createFollowup({
              embeds: [
                new RichEmbed()
                  .setColor(RichEmbed.embedColor)
                  .setDescription(
                    "Queue must have at least **1 track** to skip."
                  ),
              ],
              flags: 64,
            });
            return;
          }
          msg = await ruqa.getMessage(
            interaction.channel.id,
            interaction.message.id
          );
          player?.skip();
          await msg.delete();
          break;

        case "stop":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          player?.destroy();
          msg = await ruqa.getMessage(
            interaction.channel.id,
            interaction.message.id
          );
          await msg.delete();
          if (ruqa.cacheNpMsgID) {
            ruqa.cacheNpMsgID.delete();
          }
          break;
      }

      /**
       * @description Nowplaying button ID handling
       * The main reason to create two switch, to split two different stuff.
       */

      switch (interaction.data.custom_id) {
        case "np_pauseOrResume":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          if (player?.paused) {
            player?.pause(false);
            msg = await ruqa.getMessage(
              interaction.channel.id,
              interaction.message.id
            );
            await msg.edit({
              components: [
                {
                  type: Constants.ComponentTypes.ACTION_ROW,
                  components: nowplayingButtons,
                },
              ],
            });
            if (ruqa.cacheMsgID) {
              ruqa.cacheMsgID.edit({
                components: [
                  {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: trackStartButtons,
                  },
                ],
              });
            }
          } else {
            player?.pause(true);
            msg = await ruqa.getMessage(
              interaction.channel.id,
              interaction.message.id
            );
            msg.edit({
              components: [
                {
                  type: Constants.ComponentTypes.ACTION_ROW,
                  components: nowplayingModifier,
                },
              ],
            });
            if (ruqa.cacheMsgID) {
              ruqa.cacheMsgID.edit({
                components: [
                  {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: trackStartModifier,
                  },
                ],
              });
            }
          }
          break;

        case "np_skip":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          if (player!.queue.length < 1) {
            await interaction.createFollowup({
              embeds: [
                new RichEmbed()
                  .setColor(RichEmbed.embedColor)
                  .setDescription(
                    "Queue must have at least **1 track** to skip."
                  ),
              ],
              flags: 64,
            });
            return;
          }
          msg = await ruqa.getMessage(
            interaction.channel.id,
            interaction.message.id
          );
          ruqa.audio.emit("trackEnd", () => {});
          player?.skip();
          await msg.delete();
          break;

        case "np_refresh":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          msg = await ruqa.getMessage(
            interaction.channel.id,
            interaction.message.id
          );
          const track = player?.current;
          const [bar, percentage] = buildProgressBar(
            track?.isStream ? 1 : track?.duration,
            track?.isStream ? 1 : player?.position
          );

          const embed = new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setAuthor(
              player?.current?.title ?? "Unknown title",
              player?.current?.uri
            )
            .setThumbnail(
              player?.current?.identifier
                ? `https://img.youtube.com/vi/${player?.current?.identifier}/default.jpg`
                : ""
            )
            .setDescription(
              `\n\n**Author**: ${player?.current?.author}\n**Requester**: <@!${
                (player?.current?.requester as User).id
              }>\n**Duration**: ${prettyMs(Number(player?.current?.duration), {
                verbose: true,
              })}`
            )
            .addField(
              "Upcoming",
              player?.queue[0]
                ? `[${player.queue[0].title}](${player.queue[0].uri})`
                : "There are no upcoming track(s) in the queue"
            )
            .addField(
              "Progress",
              `${bar}\n` +
                `${
                  player?.current?.isStream
                    ? "Stream"
                    : `${prettyMs(Number(player?.exactPosition), {
                        verbose: true,
                      })} (${Number(percentage).toFixed(2)}%)`
                }`
            );

          await msg.edit({ embeds: [embed] });
          break;

        case "np_stop":
          if (!(await onlyAllowedRequester(interaction, player!))) {
            return;
          }
          player?.destroy();
          msg = await ruqa.getMessage(
            interaction.channel.id,
            interaction.message.id
          );
          await msg.delete();
          if (ruqa.cacheNpMsgID) {
            ruqa.cacheNpMsgID.delete();
          }
          break;
      }

      /**
       * @description Queue interaction handler
       */

      switch (interaction.data.custom_id) {
        case "q_previousStart":
          ruqa.page = ruqa.page > 0 ? 0 : ruqa.pages.length - 1;
          await ruqa.cacheQueueMsg.edit({
            embeds: [
              new RichEmbed()
                .setDescription(`**Queued Tracks**\n\n${ruqa.pages[ruqa.page]}`)
                .setColor(RichEmbed.embedColor)
                .setFooter(`Page ${ruqa.page + 1}/${ruqa.pages.length}`),
            ],
          });
          break;

        case "q_previous":
          ruqa.page = ruqa.page > 0 ? --ruqa.page : ruqa.pages.length - 1;
          await ruqa.cacheQueueMsg.edit({
            embeds: [
              new RichEmbed()
                .setDescription(`**Queued Tracks**\n\n${ruqa.pages[ruqa.page]}`)
                .setColor(RichEmbed.embedColor)
                .setFooter(`Page ${ruqa.page + 1}/${ruqa.pages.length}`),
            ],
          });
          break;

        case "q_forward":
          ruqa.page = ruqa.page + 1 < ruqa.pages.length ? ++ruqa.page : 0;
          await ruqa.cacheQueueMsg.edit({
            embeds: [
              new RichEmbed()
                .setDescription(`**Queued Tracks**\n\n${ruqa.pages[ruqa.page]}`)
                .setColor(RichEmbed.embedColor)
                .setFooter(`Page ${ruqa.page + 1}/${ruqa.pages.length}`),
            ],
          });
          break;

        case "q_forwardEnd":
          ruqa.page =
            ruqa.page + 1 < ruqa.pages.length ? ruqa.pages.length - 1 : 0;
          await ruqa.cacheQueueMsg.edit({
            embeds: [
              new RichEmbed()
                .setDescription(`**Queued Tracks**\n\n${ruqa.pages[ruqa.page]}`)
                .setColor(RichEmbed.embedColor)
                .setFooter(`Page ${ruqa.page + 1}/${ruqa.pages.length}`),
            ],
          });
          break;

        case "q_delete":
          msg = await ruqa.getMessage(
            interaction.channel.id,
            interaction.message.id
          );
          await msg.delete();
          break;
      }
    }
  }
);
