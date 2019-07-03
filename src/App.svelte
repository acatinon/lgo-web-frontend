<script>
  import TransportU2F from "@ledgerhq/hw-transport-u2f";
  import Btc from "@ledgerhq/hw-app-btc";
  import { getPublicKey } from "./utils/path_finder";
  import { Observable } from "rxjs";
  import { onMount } from "svelte";
  import { open, subscribe, unsubscribe } from "./services/common";
  import { products, currentProduct } from "./stores/products";

  import TradeList from "./components/TradeList.svelte";
  import OrderList from "./components/OrderList.svelte";
  import PlaceOrder from "./components/PlaceOrder.svelte";

  onMount(async () => {
    open().then(() => subscribe(currentProduct.id));

    currentProduct.subscribe(product => {
      unsubscribe(currentProduct.getPreviousValue().id)
      subscribe(product.id)
  });

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

<select bind:value={$currentProduct}>
  {#each $products as product}
    <option value={product}>{product.id}</option>
  {/each}
</select>
<TradeList />
<OrderList />
<br />
<PlaceOrder />
