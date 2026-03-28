import { MatrixEvent, Room } from "matrix-js-sdk";
import { ModuleDefinition } from "../interfaces/ModuleDefinition.d.ts";
import { client } from "../systems/client.ts";

const diacreticsMap: Record<string, string> = {
	'ą': 'a',
	'ć': 'c',
	'ę': 'e',
	'ł': 'l',
	'ó': 'o',
	'ś': 's',
	'ż': 'z',
	'ź': 'z',
};
const charMap: Record<string, string> = {
	'a': '🇦',
	'b': '🇧',
	'c': '🇨',
	'd': '🇩',
	'e': '🇪',
	'f': '🇫',
	'g': '🇬',
	'h': '🇭',
	'i': '🇮',
	'j': '🇯',
	'k': '🇰',
	'l': '🇱',
	'm': '🇲',
	'n': '🇳',
	'o': '🇴',
	'p': '🇵',
	'q': '🇶',
	'r': '🇷',
	's': '🇸',
	't': '🇹',
	'u': '🇺',
	'v': '🇻',
	'w': '🇼',
	'x': '🇽',
	'y': '🇾',
	'z': '🇿',
	'0': '0️⃣',
	'1': '1️⃣',
	'2': '2️⃣',
	'3': '3️⃣',
	'4': '4️⃣',
	'5': '5️⃣',
	'6': '6️⃣',
	'7': '7️⃣',
	'8': '8️⃣',
	'9': '9️⃣',
	'#': '#️⃣',
	'*': '*️⃣',
	'!': '❗',
	'?': '❓',
	' ': '\n',
};

const cmdRegex = /^emoji (.+)/;
const definition: ModuleDefinition = {
	name: 'emoji',
	chatCommands: [{
		regex: cmdRegex,
		usageExample: 'emoji <dowolny tekst>',
		usageDescription: 'robi emotki :)))))',
		handler: (rawCmd: string, _event: MatrixEvent, room: Room) => {
			const matches = cmdRegex.exec(rawCmd);
			const rawText = matches?.[1];
			if (!rawText) return;

			const processedText: string = rawText
				.toLowerCase()
				.split('')
				.map(char => diacreticsMap[char] || char)
				.map(char => charMap[char] ? (charMap[char] + ' ') : char)
				.join('')
				.replaceAll('\n ', '\n');
			
			client.sendTextMessage(room.roomId, processedText);
		},
	}],
};

export default definition;