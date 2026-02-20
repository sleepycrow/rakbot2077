import { MatrixEvent, Room } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../client.ts";

const BASE_URL = 'https://komixxy.pl';
const IMAGE_REGEX = /src=\"(\/uimages\/[^.]+\.(?:jpg|jpeg|png))\"/gi;

async function getImageUrl(): Promise<string> {
	const resp = await fetch(`${BASE_URL}/losuj`);
	const rawText = await resp.text();

	const matches = IMAGE_REGEX.exec(rawText);
	if (!matches || !matches[1]) throw new Error('could not retrieve image');

	return BASE_URL + matches[1];
}

const definition: ModuleDefinition = {
	name: 'komixx',
	chatCommands: [{
		regex: /^komixx$/,
		usageExample: 'komixx',
		usageDescription: 'zapodaje najśmieszniejszego mema świata na świecie',
		handler: async (_rawCmd: string, _event: MatrixEvent, room: Room) => {
			const imgUrl = await getImageUrl();

			const filename = imgUrl.split('/').pop() as string;
			const fileFetch = await fetch(imgUrl);
			const fileBlob = await fileFetch.blob();

			if (fileBlob.type.substring(0, 5) !== 'image') throw new Error('could not retrieve image');
			
			const { content_uri } = await client.uploadContent(fileBlob, { name: filename });
			client.sendImageMessage(room.roomId, content_uri, { mimetype: fileBlob.type }, filename);
		},
	}],
};

export default definition;