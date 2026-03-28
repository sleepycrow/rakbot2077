import { MatrixEvent, Room } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../systems/client.ts";

const IMAGE_URL = 'mxc://tchncs.de/c3d1fd74bcaf769f84d59fe1370d3e79a11fc7a72024434911519178752';
const definition: ModuleDefinition = {
	name: 'kurwa',
	chatCommands: [{
		regex: /^kurwa$/,
		usageExample: 'kurwa',
		usageDescription: 'ty no wiesz ten no ten teges no kurwa',
		handler: (_rawCmd: string, _event: MatrixEvent, room: Room) => {
			client.sendStickerMessage(room.roomId, IMAGE_URL);
		},
	}],
};

export default definition;