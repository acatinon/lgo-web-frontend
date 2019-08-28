<script>
  import "fomantic-ui-less/semantic.less";
  import "./js/semantic.js";
  import { onMount } from "svelte";
  import { setTheme } from "./utils/ui";
  import { Trade } from "./domain/trade";
  import { getTrades } from "./services/trades";
  import { theme } from "./stores/settings";
  import Menu from "./components/Menu.svelte";
  import { color } from "./utils/ui";
  import Date from "./components/Date.svelte";
  import Side from "./components/Side.svelte";
  import FocusedNumber from "./components/FocusedNumber.svelte";
  
  let trades = [];

  onMount(async () => {
    setTheme($theme);

    jQuery(".menu .item").tab({
      onLoad: async tabPath => {
        switch (tabPath) {
          case "trades":
            trades = await getTrades("BTC-USD");
            break;
        }
      }
    });
  });
</script>

<div id="site">
  <Menu activePage="history">
    <span class="item">History</span>
  </Menu>
  <div class="ui container">
    <div class="ui fluid card">
      <div class="title content">
        <h3 class="header">History</h3>
      </div>
      <div class="content">
        <div class="ui top secondary pointing menu">
          <a class="active item" data-tab="orders">Orders</a>
          <a class="item" data-tab="trades">Trades</a>
        </div>
        <div class="ui active tab segment" data-tab="orders">First</div>
        <div class="ui tab segment" data-tab="trades">
          <table class="ui compact basic table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product</th>
                <th>Order Id</th>
                <th>Side</th>
                <th class="right aligned">Quantity</th>
                <th class="right aligned">Fees</th>
                <th class="right aligned">Price</th>
                <th class="right aligned">Date</th>
              </tr>
            </thead>
            <tbody>
              {#each trades as trade (trade.id)}
                <tr>
                  <td>
                    {trade.id}
                  </td>
                  <td>
                    {trade.product_id}
                  </td>
                  <td>
                    {trade.order_id}
                  </td>
                  <td>
                    <Side value={trade.side} />
                  </td>
                  <td class="right aligned">
                    <FocusedNumber value={trade.quantity} />
                  </td>
                  <td class="right aligned">
                    <FocusedNumber value={trade.fees} />
                  </td>
                  <td class="right aligned">
                    <span class="ui {color(trade.side)} text">
                      {trade.price.toFormat(2)}
                    </span>
                  </td>
                  <td class="right aligned">
                    <Date value={trade.creation_date} />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
