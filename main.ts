import * as sdk from 'matrix-js-sdk';
import { client, initClient } from "./client.ts";
import { getCommandHandler, loadModules } from "./moduleManager.ts";
import { CONFIG } from "./config.ts";
import { isUserMessage } from "./utils/eventUtils.ts";

// Module imports -----
import helpModule from "./modules/help.ts";
import emojiModule from "./modules/emoji.ts";
import kurwaModule from "./modules/kurwa.ts";
import antiRakModule from "./modules/antirak.ts";
import komixxModule from "./modules/komixx.ts";
import ytongModule from "./modules/ytong.ts";
import e621Module from "./modules/e621.ts";
// --------------------

await initClient();
await loadModules([
	helpModule,
	emojiModule,
	kurwaModule,
	antiRakModule,
	komixxModule,
	ytongModule,
	e621Module,
]);

client.on(sdk.RoomEvent.MyMembership, (room: sdk.Room, membership: sdk.Membership, _prevMembership?: sdk.Membership) => {
	if (membership === sdk.KnownMembership.Invite) {
		client.joinRoom(room.roomId)
			.then(() => console.log('Auto-joined room %s (%s)', room.name, room.roomId));
	}
});

client.on(sdk.RoomEvent.Timeline, async (event: sdk.MatrixEvent, room?: sdk.Room, toStartOfTimeline?: boolean) => {
	if (toStartOfTimeline || !room || !isUserMessage(event)) return;

	const msgContent: string = event.getContent().body ?? '';
	if (msgContent.length > 1 && msgContent[0] === CONFIG.cmdPrefix) {
		const rawCmd = msgContent.substring(1).trim();
		const handler = getCommandHandler(rawCmd);
		if (handler) {
			try {
				const handlerResult = handler(rawCmd, event, room);

				if (handlerResult instanceof Promise) {
					client.sendTyping(room.roomId, true, 10000);
					await handlerResult;
					client.sendTyping(room.roomId, false, 0);
				}
			} catch (e) {
				console.error('[ERR] Error occured while running command "%s"', rawCmd, e);
				client.sendNotice(room.roomId, `⚠️ nie wyszło przy robieniu "${rawCmd}" :((`);
			}
		}
	}
});
