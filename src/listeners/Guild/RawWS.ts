import type { RawPacket } from "eris";
import Event from "../../structures/Event";
import ruqa from "../../index"

export default new Event("rawWS", (packet: RawPacket) => {
    switch (packet.t) {
        case "VOICE_SERVER_UPDATE":
            ruqa.audio?.handleVoiceUpdate(packet);
        break;

        case "VOICE_STATE_UPDATE":
            ruqa.audio?.handleVoiceUpdate(packet);
        break;

        default:
        break;
    }
});
