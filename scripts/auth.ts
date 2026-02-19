import * as sdk from 'matrix-js-sdk';
import { CONFIG } from "../config.ts";

const client = sdk.createClient({
	baseUrl: Deno.env.get('BASE_URL') ?? '',
});

client.loginRequest({
	type: sdk.AuthType.Password,
	device_id: CONFIG.deviceId,
	identifier: {
		type: 'm.id.user',
		user: Deno.env.get('USER_ID') ?? '',
	},
	password: Deno.env.get('PASSWORD') ?? '',
}).then(console.log);