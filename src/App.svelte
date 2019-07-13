<script>
  import "./css/main.less";
  import "./js/semantic.js";
  import TransportU2F from "@ledgerhq/hw-transport-u2f";
  import Btc from "@ledgerhq/hw-app-btc";
  import { getPublicKey } from "./utils/path_finder";
  import { Observable } from "rxjs";
  import { onMount } from "svelte";
  import {
    open,
    isOpened,
    isOpening,
    subscribe,
    unsubscribe
  } from "./services/common";
  import { currentProduct } from "./stores/products";

  import TradeList from "./components/TradeList.svelte";
  import OrderList from "./components/OrderList.svelte";
  import PlaceOrder from "./components/PlaceOrder.svelte";
  import Product from "./components/Product.svelte";
  import OrderBook from "./components/OrderBook.svelte";

  onMount(async () => {
    currentProduct.subscribe(productId => {
      if (productId !== undefined) {
        if (isOpened()) {
          const previousValue = currentProduct.getPreviousValue();
          if (previousValue !== undefined) {
            unsubscribe(previousValue);
          }
          subscribe(productId);
        } else if (!isOpening()) {
          open().then(() => subscribe(productId));
        }
      }
    });
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

<div class="ui visible left very thin sidebar vertical menu">
  <span class="item">1</span>
  <span class="item">2</span>
  <span class="item">3</span>
</div>
<div id="main" class="pusher">
  <div id="product">
    <Product />
    <PlaceOrder />
  </div>
  <div id="orderbook">
    <OrderBook />
  </div>
  <div id="trading">

    <div id="chart">
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
    </div>

    <div id="meta">
      <div id="orders">
        <OrderList />
      </div>
      <div id="trades">
        <TradeList />
      </div>
    </div>

  </div>
</div>
