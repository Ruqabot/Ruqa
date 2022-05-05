/**
 * @ignore This is a test file, you can safely ignore it.
 */

import { ComponentInteraction, Constants, type Message, type User } from "eris";
import { Player } from "vulkava";
import RichEmbed from "./RichEmbed";
import ruqa from "../index";
import DJRole from "../models/DJRole";

export async function buildMsg(message: Message, desc: string): Promise<void> {
  message.channel.createMessage({
    embeds: [
      new RichEmbed().setColor(RichEmbed.embedColor).setDescription(desc),
    ],
  });
}

export async function notInVC(message: Message): Promise<boolean> {
  if (!message.member?.voiceState.channelID) {
    await buildMsg(
      message,
      "You need to be in a voice channel before executing this command."
    );
    return false;
  }
  return true;
}

export async function notInSameVC(message: Message): Promise<boolean> {
  const restMember = await ruqa.getRESTGuildMember(
    message.guildID!,
    ruqa.user.id
  );
  if (restMember.voiceState.channelID) {
    if (
      restMember.voiceState.channelID !== message.member?.voiceState.channelID
    ) {
      await buildMsg(
        message,
        `You need to join <#${restMember.voiceState.channelID}> channel to use this command buddy.`
      );
      return false;
    }
  }
  return true;
}

export async function checkPerm(
  message: Message,
  desc: string,
  perm: keyof Constants["Permissions"]
): Promise<boolean> {
  if (!message.member?.permissions.has(perm)) {
    await buildMsg(message, desc);
    return false;
  }
  return true;
}

export async function onlyAllowedRequester(
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

export async function configuredDJRole(message: Message): Promise<boolean> {
  const data = await DJRole.findOne({ guildID: message.guildID! });

  if (data) {
    if (data?.configuredRole) {
      if (!message.member?.roles.find((x) => x === data?.configuredRole)) {
        await message.channel.createMessage({
          embeds: [
            new RichEmbed()
              .setColor(RichEmbed.embedColor)
              .setDescription(
                "You don't have the DJ role to use this command."
              ),
          ],
          flags: 64,
        });
        return false;
      }
    }
  }
  return true;
}

export async function isPlayerActive(
  message: Message
): Promise<[Player | undefined, boolean]> {
  const audio = ruqa.audio.players?.get(message.guildID!);
  if (!audio || !audio?.current) {
    await message.channel.createMessage({
      embeds: [
        new RichEmbed()
          .setColor(RichEmbed.embedColor)
          .setDescription("I'm nothing playing right now."),
      ],
    });
    return [audio, false];
  }
  return [audio, true];
}

export function playerHasFilters(player: Player): void {
  // eslint-disable-next-line no-unused-expressions
  Object.keys(player?.filters.active!).length > 0
    ? player?.filters.clear()
    : undefined;
}
