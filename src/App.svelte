<script>
	import TransportU2F from "@ledgerhq/hw-transport-u2f";
	import Btc from "@ledgerhq/hw-app-btc";
	import { getPublicKey } from "./utils/path_finder";
	import { Observable } from 'rxjs';

	let isLedgerReady = false;
	let publicKey = null;
/*
	TransportU2F.listen({
		next: async e => {
    		if (e.type === "add" && e.descriptor !== null) {
				const transport = await TransportU2F.open(e.descriptor);
				isLedgerReady = true;

				const btc = new Btc(transport);
				let path = "49'/1'/0'/0/0";

				publicKey = await getPublicKey(
					btc,
					path.split("/")[0],
					path.split("/")[1],
					path.split("/")[2]);
    		}
		},
		complete: () => {},
		error: error => {alert(error)}
	});
*/
	const socket = new WebSocket("ws://localhost:3002");

	socket.onopen =  function socketOpen() {
		const message = {
			type: 'subscribe',
			channels: [
				{
					name: 'user',
					product_id: 'BTC-USD'
				},
				{
					name: 'afr'
				},
				{
					name: 'balance'
				},
				{
					name: 'level2',
					product_id: 'BTC-USD'
				},
				{
					name: 'trades',
					product_id: 'BTC-USD'
				}
			]
		};
		socket.send(JSON.stringify(message));
	}

	socket.onmessage = function (event) {
		console.log(event.data);
	}

	socket.onerror = function (event) {
		console.error("WebSocket error observed:", event);
	};

/*
	Observable.create(TransportU2F.listen).subscribe({
		next: async e => {
    		if (e.type === "add") {
				const transport = await TransportU2F.open(e.descriptor);
				isLedgerReady = true;

				const btc = new Btc(transport);
				let path = "49'/1'/0'/0/0";

				publicKey = await getPublicKey(
					btc,
					path.split("/")[0],
					path.split("/")[1],
					path.split("/")[2]);
    		}
    	}
	});*/

</script>

{#if isLedgerReady}
{#if publicKey}
<h1>Connected !</h1>
<pre>{publicKey}</pre>
{:else}
<h1>Waiting for device...</h1>
{/if}
{:else}
<h1>Please connect and unlock your device...</h1>
{/if}