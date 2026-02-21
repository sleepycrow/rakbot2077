import { MatrixEvent, Room } from "matrix-js-sdk";
import { JSDOM } from "jsdom";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../client.ts";

type GetMode = 'RANDOM' | 'NEWEST';

const LATEST_URL = 'https://wykop.pl/tag/konkursnanajbardziejgownianymemznosaczem';
const RANDOM_URL = 'https://wykop.pl/tag/konkursnanajbardziejgownianymemznosaczem/archiwum/'
const RAND_YEAR_MIN = 2022;
const RAND_YEAR_MAX = new Date().getFullYear() - 1;

async function getImageUrl(mode: GetMode = 'RANDOM'): Promise<string> {
	// jest nasrane petli duwaj bo sie to wypierdala czasem w jakis
	// zjebany niezrozumialy sposob wiec jak cos nie dziala to po prostu
	// robimy inny request od nowa
	
	let nodes = [];
	do {
		let rawText = '';
		do {
			let pageUrl = LATEST_URL;

			if (mode == 'RANDOM') {
				const year = Math.floor(Math.random() * (RAND_YEAR_MAX - RAND_YEAR_MIN + 1)) + RAND_YEAR_MIN;
				const month = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
				const month_stringed = month.toString().padStart(2, '0');
				const page = Math.floor(Math.random() * (7 - 1 + 1)) + 1; // max out at 7 to be safe
				pageUrl = `${RANDOM_URL}${year}-${month_stringed}/strona/${page}`;
			}

			const resp = await fetch(`${pageUrl}`, {
				headers: { 'User-Agent': 'rakbot MCP agent - important, do not block' }
			});
			rawText = await resp.text();
		} while (rawText.length > 800000); // JSDOM seems to error out when the document is too large

		const parser = new JSDOM(rawText);
		const doc = parser.window.document;
		nodes = doc.querySelectorAll('section.entry.stream-tag > article > div img');
	} while (nodes.length == 0);

	const node = (mode === 'RANDOM')
		? nodes[Math.floor(Math.random() * nodes.length)]
		: nodes[0];
	return node.src;
}

const definition: ModuleDefinition = {
	name: 'ytong',
	chatCommands: [{
		regex: /^ytong/,
		usageExample: 'ytong [newest]',
		usageDescription: 'uczy pokuty',
		handler: async (rawCmd: string, _event: MatrixEvent, room: Room) => {
			const mode: GetMode = (rawCmd.includes('newest') ? 'NEWEST' : 'RANDOM');
			const imgUrl = await getImageUrl(mode);

			const filename = imgUrl.split('?')[0]
				?.split('/')
				.pop() ?? 'image.png';
			const fileFetch = await fetch(imgUrl);
			const fileBlob = await fileFetch.blob();
			const filetype = fileBlob.type;

			if (fileBlob.type.substring(0, 5) !== 'image') throw new Error('could not retrieve image');

			const { content_uri } = await client.uploadContent(fileBlob, { name: filename });
			client.sendImageMessage(room.roomId, content_uri, { mimetype: filetype }, filename);
		},
	}],
};

export default definition;
