import { MatrixEvent, Room } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../client.ts";

const cmdRegex = /^e621 (.+)/;
const definition: ModuleDefinition = {
	name: 'e621',
	chatCommands: [{
		regex: cmdRegex,
		usageExample: 'e621 <tagi>',
		usageDescription: 'pokazuje wholesome obrazki inspiracyjne aby zainspirować cały twój skład',
		handler: async (rawCmd: string, _event: MatrixEvent, room: Room) => {
			const matches = cmdRegex.exec(rawCmd);
			const tags = matches?.[1];
			if (!tags) return;

			const rawResp = await fetch('https://e621.net/posts.json?tags=' + encodeURIComponent(tags), {
				headers: { 'User-Agent': 'Rakbot2077/1.0 (by petcryptid)' }
			});
			const resp = await rawResp.json();
			const posts = resp?.posts ?? [];

			if (!posts.length) {
				client.sendNotice(room.roomId, '😢 nie znaleziono żadnych dzieł o takich tagach');
				return;
			}

			const randomId = Math.round(Math.random() * posts.length);
			const post = posts[randomId];

			const tagLines = [];
			for (const category in post.tags) {
				const tags = post.tags[category] ?? [];
				if (!tags.length) continue;

				tagLines.push(`${category.toUpperCase()}: ${tags.join(' ')}`);
			}
			const postUrl = `https://e621.net/posts/${post.id}`;

			client.sendTextMessage(room.roomId, tagLines.join('\n') + '\n\n' + postUrl)
		},
	}],
};

export default definition;