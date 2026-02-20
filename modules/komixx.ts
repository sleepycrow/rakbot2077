import { MatrixEvent, Room } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../client.ts";
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://komixxy.pl';

async function getImageUrl(): Promise<string> {
	const resp = await fetch(`${BASE_URL}/losuj`);
	const rawText = await resp.text();
	const dom = new JSDOM(rawText);

	const imgUrl = dom.window.document.querySelector('.picwrapper img')?.getAttribute('src');
	if (!imgUrl) throw new Error('could not retrieve image');

	return BASE_URL + imgUrl;
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
			
			const { content_uri } = await client.uploadContent(fileBlob, { name: filename });

			client.sendImageMessage(room.roomId, content_uri, { mimetype: fileBlob.type }, filename);
		},
	}],
};

export default definition;