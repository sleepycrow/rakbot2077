import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../systems/client.ts";
import { isUserMessage } from "../utils/eventUtils.ts";

const definition: ModuleDefinition = {
	name: 'antirak',
	init: () => {
		client.on(RoomEvent.Timeline, (event: MatrixEvent, room?: Room, toStartOfTimeline?: boolean) => {
			if (toStartOfTimeline || !room || !isUserMessage(event)) return;
		
			const msgContent: string = event.getContent().body ?? '';
			if (msgContent.includes('😂')) {
				client.sendEvent(room.roomId, 'm.reaction', {
					'm.relates_to': {
						event_id: event.getId(),
						key: '👎',
						rel_type: 'm.annotation'
					}
				});
			}
		});
	}
};

export default definition;