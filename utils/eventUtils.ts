import { EventType, MatrixEvent } from "matrix-js-sdk";
import { OWN_USER_ID, START_TIME } from "../client.ts";

export function isUserMessage(event: MatrixEvent): boolean {
	const date = event.getDate();
	return Boolean(
		event.getType() === EventType.RoomMessage
		&& event.getSender() !== OWN_USER_ID
		&& (date && date > START_TIME)
	);
}