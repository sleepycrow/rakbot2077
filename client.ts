import * as sdk from 'matrix-js-sdk';
import { CONFIG } from "./config.ts";

export let START_TIME: Date;
export let OWN_USER_ID: string | null;

export const client = sdk.createClient({
	baseUrl: Deno.env.get('BASE_URL') ?? '',
	userId: Deno.env.get('USER_ID') ?? '',
	deviceId: CONFIG.deviceId,
	accessToken: Deno.env.get('TOKEN') ?? '',
});

function waitUntilSyncPrepared(): Promise<void> {
	return new Promise<void>((res, rej) => {
		client.once(sdk.ClientEvent.Sync, (state: sdk.SyncState) => {
			if (state === sdk.SyncState.Prepared) res();
			rej();
		});
	});
}

export async function initClient(): Promise<void> {
	//await client.initRustCrypto({ useIndexedDB: false });

	client.startClient();
	await waitUntilSyncPrepared();

	OWN_USER_ID = await client.getUserId();
	START_TIME = new Date();
}