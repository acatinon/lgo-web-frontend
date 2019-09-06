<script>
  import "fomantic-ui-less/semantic.less";
  import "./css/exchange.less";
  import "./css/overlay-scrollbars.css";
  import "./js/semantic.js";
  import "./js/jquery.overlay-scrollbars.js";
  import TransportU2F from "@ledgerhq/hw-transport-u2f";
  import Btc from "@ledgerhq/hw-app-btc";
  import { theme } from "./stores/settings";
  import { getPublicKey } from "./utils/path_finder";
  import { addToast, MessageType } from "./utils/toasts";
  import { setTheme, Page } from "./utils/ui";
  import { Observable } from "rxjs";
  import { onMount } from "svelte";
  import {
    open,
    isOpened,
    isOpening,
    subscribe,
    unsubscribe,
    addListener
  } from "./services/common";
  import { currentProduct } from "./stores/products";

  import TradeList from "./components/exchange/TradeList.svelte";
  import OrderList from "./components/exchange/OrderList.svelte";
  import PlaceOrder from "./components/exchange/PlaceOrder.svelte";
  import Menu from "./components/exchange/Menu.svelte";
  import OrderBook from "./components/exchange/OrderBook.svelte";
  import Chart from "./components/exchange/Chart.svelte";
  import Settings from "./components/Settings.svelte";

  function setUpToasts() {
    addListener(data => {
      if (data.channel === "user" && data.type === "update") {
        for (let p of data.payload) {
          switch (p.type) {
            case "done":
              switch (p.reason) {
                case "canceled":
                  addToast(
                    "Order canceled",
                    "Your order has been successfully canceled",
                    MessageType.Success
                  );
                  break;
              }
              break;
            case "open":
              addToast(
                "Order created",
                "Your order has been successfully created",
                MessageType.Success
              );
              break;
            case "invalid":
              addToast(
                "Order invalid",
                `The order ${p.order_id} is invalid`,
                MessageType.Error
              );
              break;
          }
        }
      }
    });
  }

  onMount(async () => {
    setUpToasts();
    setTheme($theme, Page.Exchange);

    theme.subscribe(value => {
      if (value) {
        setTheme(value, Page.Exchange);
      }
    });

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

<div id="site">
  <Menu />
  <div id="panes">
    <div id="user">
      <PlaceOrder />
      <OrderList />
    </div>
    <div id="meta">
      <Chart />
      <OrderBook />
    </div>
    <TradeList />
  </div>
</div>
<Settings />
