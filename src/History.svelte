<script>
  import "fomantic-ui-less/semantic.less";
  import "./css/history.less";
  import "./css/overlay-scrollbars.css";
  import "./js/semantic.js";
  import "./js/jquery.overlay-scrollbars.js";
  import { onMount } from "svelte";
  import { setTheme, Page } from "./utils/ui";
  import { Trade } from "./domain/trade";
  import { getTrades } from "./services/trades";
  import { theme } from "./stores/settings";
  import Menu from "./components/Menu.svelte";
  import { color } from "./utils/ui";
  import BigNumber from "bignumber.js";
  import moment from "moment";
  import Date from "./components/Date.svelte";
  import Side from "./components/Side.svelte";
  import FocusedNumber from "./components/FocusedNumber.svelte";

  let trades = [];
  let nextPage;
  let previousPages = [];

  onMount(async () => {
    setTheme($theme, Page.History);

    jQuery(".menu .item").tab({
      onLoad: async tabPath => {
        switch (tabPath) {
          case "trades":
            queryTrades();
            break;
        }
      }
    });

    jQuery("#history .scrollable").overlayScrollbars().options({
      callbacks: {
        onScrollStop: function() {
          const state = this.scroll();
          if (state.max.y - state.position.y < 100) {
            queryTrades();
          }
        }
      }
    });
  });

  async function queryTrades() {
    const response = await getTrades("BTC-USD", nextPage);

    for (let t of response.body.result.trades) {
      const newTrade = {
        id: t.id,
        product_id: t.product_id,
        quantity: new BigNumber(t.quantity),
        price: new BigNumber(t.price),
        fees: new BigNumber(t.fees),
        creation_date: moment(t.creation_date),
        side: t.side,
        order_id: t.order_id,
        liquidity: t.liquidity
      };

      trades = [...trades, newTrade];
    }

    nextPage = response.body.next_page;
  }

  function goToNextPage() {
    queryTrades();
  }
</script>

<div id="site">
  <Menu activePage="history">
    <span class="item">History</span>
  </Menu>
  <div class="ui container">
    <div id="history" class="ui fluid card">
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
          <table class="ui compact basic fixed table">
            <thead>
              <tr>
                <th class="two wide">Id</th>
                <th class="two wide">Product</th>
                <th class="three wide">Order Id</th>
                <th class="one wide">Side</th>
                <th class="two wide right aligned">Quantity</th>
                <th class="two wide right aligned">Fees</th>
                <th class="two wide right aligned">Price</th>
                <th class="three wide right aligned">Date</th>
              </tr>
            </thead>
          </table>
          <div class="scrollable content">
            <table class="ui compact basic fixed table">
              <tbody>
                {#each trades as trade (trade.id)}
                  <tr>
                    <td class="two wide">{trade.id}</td>
                    <td class="two wide">{trade.product_id}</td>
                    <td class="three wide">{trade.order_id}</td>
                    <td class="one wide">
                      <Side value={trade.side} />
                    </td>
                    <td class="two wide right aligned">
                      <FocusedNumber value={trade.quantity} />
                    </td>
                    <td class="two wide right aligned">
                      <FocusedNumber value={trade.fees} />
                    </td>
                    <td class="two wide right aligned">
                      <span class="ui {color(trade.side)} text">
                        {trade.price.toFormat(2)}
                      </span>
                    </td>
                    <td class="three wide right aligned">
                      <Date value={trade.creation_date} format="ll LT" />
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <div class="ui very padded segment">
              <div class="ui active centered inline loader" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
