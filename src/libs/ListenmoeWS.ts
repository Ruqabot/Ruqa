import WebSocket from "ws";
import type { ListenMoeData } from "../interfaces/ListenMoeData";

export class ListenmoeWS {
  public url: string;

  #ws?: WebSocket;

  public timeHeartBeat?: ReturnType<typeof setTimeout>;

  public data?: ListenMoeData;

  public constructor(url: string) {
    this.url = url;
  }

  public async connect(): Promise<this> {
    this.#ws = new WebSocket(this.url) as WebSocket;
    this.#ws.on("open", this.onOpen.bind(this));
    this.#ws.on("close", this.onClose.bind(this));
    this.#ws.on("error", this.onError.bind(this));
    this.#ws.on("message", this.onMessage.bind(this));
    return this;
  }

  public heartBeat(waitTime: number): void {
    this.timeHeartBeat = setTimeout(
      () => this.#ws!.send(JSON.stringify({ op: 9 })),
      waitTime
    );
  }

  public onOpen() {
    this.#ws!.send(JSON.stringify({ op: 0, d: { auth: "" } }));
  }

  public onClose() {
    setTimeout(() => this.connect(), 5e3);
  }

  public onError() {
    this.#ws!.close(1000);
    this.#ws?.removeAllListeners();
  }

  public onMessage(data: string): ListenMoeData | undefined {
    if (!data || !data?.length) {
      return undefined;
    }
    let msg;
    // eslint-disable-next-line no-unused-expressions
    data ? (msg = JSON.parse(data)) : undefined;

    if (!msg.op) {
      this.heartBeat(msg?.d?.heartbeat);
    }
    if (msg?.t !== "TRACK_UPDATE" && msg?.t !== "TRACK_UPDATE_REQUEST") {
      return undefined;
    }

    this.data = {
      title: msg.d?.song?.title,
      artists: msg.d?.song?.artists?.length
        ? msg.d.song?.artists
            .map(
              (x: { nameRomaji: string; name: string; id: string | number }) =>
                `[${x.nameRomaji || x.name}](https://listen.moe/music/artists/${
                  x.id
                })`
            )
            .join(", ")
        : undefined,
      requester: msg.d?.requester
        ? `[${msg.d.requester?.displayName}](https://listen.moe/u/${msg.d.requester.username})`
        : undefined,
      source: msg.d?.song?.sources?.length
        ? msg.d.song?.sources
            .map(
              (x: { nameRomaji?: string; name: string }) =>
                x?.nameRomaji ?? x?.name
            )
            .join(", ")
        : undefined,
      albums:
        msg.d?.song?.albums && msg.d.song.albums?.length
          ? msg.d.song?.albums
              .map(
                (x: { name: string; id: string | number }) =>
                  `[${x?.name}](https://listen.moe/music/albums/${x?.id})`
              )
              .join(", ")
          : undefined,
      cover:
        msg.d?.song?.albums &&
        msg.d.song.albums?.length &&
        msg.d.song?.albums[0]?.image
          ? `https://cdn.listen.moe/covers/${msg.d.song?.albums[0]?.image}`
          : "https://listen.moe/images/share.jpg",
      listeners: msg.d.listeners,
      event: msg.d.event,
    };

    return this.data;
  }
}

export default {
  jpop: new ListenmoeWS("wss://listen.moe/gateway_v2").connect(),
  kpop: new ListenmoeWS("wss://listen.moe/kpop/gateway_v2").connect(),
};
