import { MatrixEvent, Room } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { getLoadedModules } from "../systems/moduleManager.ts";
import { CONFIG } from "../config.ts";
import { client } from "../systems/client.ts";

const definition: ModuleDefinition = {
	name: 'help',
	chatCommands: [{
		regex: /^help$/,
		usageExample: 'help',
		usageDescription: 'pomaga 😇',
		handler: (_rawCmd: string, _event: MatrixEvent, room: Room) => {
			const commands = getLoadedModules()
				.flatMap(module => module.chatCommands)
				.filter(cmd => cmd && cmd.usageExample && cmd.usageDescription)
				.map(cmd => `${CONFIG.cmdPrefix}${cmd?.usageExample} - ${cmd?.usageDescription}`)
				.join('\n');
			
			client.sendTextMessage(room.roomId, commands);
		},
	}],
};

export default definition;