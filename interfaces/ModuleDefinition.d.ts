import { ChatCommandDefinition } from "./ChatCommandDefinition.d.ts";

export interface ModuleDefinition {
    name: string;
    init?: () => Promise<void> | void;
    chatCommands?: ChatCommandDefinition[];
}