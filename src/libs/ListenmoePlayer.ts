import type { Message } from "eris";
import type { Player, SearchResult } from "vulkava";
import ruqa from "..";
import buildMsg from "../functions/BuildMsg";

export default class ListenmoePlayer {
  #message: Message;

  #res?: SearchResult;

  #player?: Player;

  constructor(message: Message) {
    this.#message = message;
    this.#res = undefined;
    this.#player = undefined;
  }

  public async connectListenMoe(pop: string): Promise<void> {
    const selectPop =
      pop === "jpop"
        ? "https://listen.moe/stream"
        : "https://listen.moe/kpop/stream";
    this.#res = await ruqa.audio.search(selectPop);

    this.#player = ruqa.audio.createPlayer({
      guildId: this.#message.guildID!,
      textChannelId: this.#message.channel.id,
      voiceChannelId: this.#message.member?.voiceState.channelID,
      selfDeaf: true,
    });

    this.#player.connect();
  }

  public async playListenMoe(): Promise<void> {
    switch (this.#res?.loadType) {
      case "LOAD_FAILED":
        await buildMsg(
          this.#message,
          "Something broke while loading the track/playlist."
        );
        break;

      case "TRACK_LOADED":
        this.#res.tracks[0].setRequester(this.#message.author);
        this.#player!.queue.push(this.#res.tracks[0]);
        break;
    }
    if (!this.#player!.playing) {
      await this.#player!.play();
    } else {
      await buildMsg(
        this.#message,
        "Currently, I'm playing, to queue other you can use the play command."
      );
    }
  }
}
