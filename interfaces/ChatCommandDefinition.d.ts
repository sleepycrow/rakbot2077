import { MatrixEvent, Room } from "matrix-js-sdk";

export type ChatCommandHandler = (rawCmd: string, event: MatrixEvent, room: Room) => Promise<void> | void;

export interface ChatCommandDefinition {
    regex: RegExp;
    usageExample?: string;
    usageDescription?: string;
    handler: ChatCommandHandler;
}