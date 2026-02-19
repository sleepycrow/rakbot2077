import * as sdk from 'matrix-js-sdk';
import { client, initClient } from "./client.ts";
import { getCommandHandler, loadModules } from "./moduleManager.ts";
import { CONFIG } from "./config.ts";
import { isUserMessage } from "./utils/eventUtils.ts";

// Module imports -----
import emojiModule from "./modules/emoji.ts";
import kurwaModule from "./modules/kurwa.ts";
import antiRakModule from "./modules/antirak.ts";
// --------------------

await initClient();
await loadModules([
	emojiModule,
	kurwaModule,
	antiRakModule,
]);

client.on(sdk.RoomEvent.MyMembership, (room: sdk.Room, membership: sdk.Membership, _prevMembership?: sdk.Membership) => {
	if (membership === sdk.KnownMembership.Invite) {
		client.joinRoom(room.roomId)
			.then(() => console.log('Auto-joined room %s (%s)', room.name, room.roomId));
	}
});

client.on(sdk.RoomEvent.Timeline, (event: sdk.MatrixEvent, room?: sdk.Room, toStartOfTimeline?: boolean) => {
	if (toStartOfTimeline || !room || !isUserMessage(event)) return;

	const msgContent: string = event.getContent().body ?? '';
	if (msgContent.length > 1 && msgContent[0] === CONFIG.cmdPrefix) {
		const rawCmd = msgContent.substring(1);
		const handler = getCommandHandler(rawCmd);
		if (handler) handler(rawCmd, event, room);
	}
});