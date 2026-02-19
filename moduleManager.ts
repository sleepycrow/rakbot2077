import { ChatCommandHandler } from "./interfaces/ChatCommandDefinition.d.ts";
import { ModuleDefinition } from "./interfaces/ModuleDefinition.d.ts";

const loadedModules: ModuleDefinition[] = [];

export async function loadModules(modules: ModuleDefinition[]): Promise<void> {
	console.log('[MODMAN] Loading %d modules...', modules.length);

	async function initModule(module: ModuleDefinition): Promise<void> {
		await module.init?.();
		loadedModules.push(module);
	};

	await Promise.all(modules.map(initModule));

	const modNames = loadedModules.map(module => module.name).join(', ');
	console.log('[MODMAN] Successfully loaded %d modules! (%s)', loadedModules.length, modNames);
}

export function getCommandHandler(rawCommand: string): ChatCommandHandler | undefined {
	return loadedModules
		.flatMap(module => module.chatCommands)
		.find(commandDef => commandDef?.regex.test(rawCommand))
		?.handler;
}