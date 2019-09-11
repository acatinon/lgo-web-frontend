<script>
  import "fomantic-ui-less/semantic.less";
  import "./css/history.less";
  import "./css/overlay-scrollbars.css";
  import "./js/semantic.js";
  import "./js/jquery.overlay-scrollbars.js";
  import { onMount } from "svelte";
  import { setTheme, Page } from "./utils/ui";
  import { getOrders, computeStatusDetails } from "./services/orders";
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
  import Settings from "./components/Settings.svelte";

  let orders = [];
  let trades = [];
  let ordersNextPage;
  let tradesNextPage;

  onMount(async () => {
    setTheme($theme, Page.History);

    theme.subscribe(value => {
      if (value) {
        setTheme(value, Page.History);
      }
    });

    jQuery(".menu .item").tab({
      onLoad: async tabPath => {
        switch (tabPath) {
          case "orders":
            ordersNextPage = undefined;
            queryOrders();
            break;
          case "trades":
            tradesNextPage = undefined;
            queryTrades();
            break;
        }
      }
    });

    let scrollableOrderList = jQuery(
      "#order-list .scrollable"
    ).overlayScrollbars();
    let scrollableTradeList = jQuery(
      "#trade-list .scrollable"
    ).overlayScrollbars();

    scrollableOrderList.options({
      callbacks: {
        onScrollStop: function() {
          const elements = this.getElements();
          const state = this.scroll();
          if (jQuery(elements.content).find(".loader").length > 0) {
            if (state.max.y - state.position.y < 100) {
              queryOrders();
            }
          }
        }
      }
    });

    scrollableTradeList.options({
      callbacks: {
        onScrollStop: function() {
          const elements = this.getElements();
          const state = this.scroll();
          if (jQuery(elements.content).find(".loader").length > 0) {
            if (state.max.y - state.position.y < 100) {
              queryTrades();
            }
          }
        }
      }
    });

    queryOrders();
  });

  async function queryOrders() {
    const response = await getOrders("BTC-USD", ordersNextPage);

    for (let o of response.body.result.orders) {
      const newOrder = {
        id: o.id,
        product_id: o.product_id,
        type: o.type,
        quantity: new BigNumber(o.quantity),
        price: new BigNumber(o.price),
        remaining_quantity: new BigNumber(o.remaining_quantity),
        status: o.status,
        side: o.side,
        batch_id: o.batch_id,
        creation_date: moment(o.creation_date),
        done_date: moment(o.done_date),
        status_reason: o.status_reason,
        status_details: computeStatusDetails(o.status_reason)
      };

      orders = [...orders, newOrder];
    }

    ordersNextPage = response.body.next_page;

    if (ordersNextPage === "") {
      jQuery("#order-list .content .segment").remove();
    }
  }

  async function queryTrades() {
    const response = await getTrades("BTC-USD", tradesNextPage);

    for (let o of response.body.result.trades) {
      const newTrade = {
        id: o.id,
        product_id: o.product_id,
        quantity: new BigNumber(o.quantity),
        price: new BigNumber(o.price),
        fees: new BigNumber(o.fees),
        creation_date: moment(o.creation_date),
        side: o.side,
        order_id: o.order_id,
        liquidity: o.liquidity
      };

      trades = [...trades, newTrade];
    }

    tradesNextPage = response.body.next_page;

    if (tradesNextPage === "") {
      jQuery("#trade-list .content .segment").remove();
    }
  }

  function computeStatusLabel(status, status_reason) {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "OPEN":
        return "Open";
      case "DONE":
        switch (status_reason) {
          case "Filled":
          case "Rejected":
            return status_reason;
          case "CanceledBySelfTradePrevention":
          case "CanceledByOwner":
          case "CanceledByAdministrator":
            return "Canceled";
        }
      case "INVALID":
        return "Invalid";
    }
  }

  function computeColor(status_reason) {
    switch (status_reason) {
      case "Pending":
        return "grey";
      case "Filled":
        return "green";
      case "CanceledBySelfTradePrevention":
      case "CanceledByOwner":
      case "CanceledByAdministrator":
        return "olive";
      case "Rejected":
        return "orange";
      case "InvalidQuantity":
      case "InvalidPrice":
      case "InvalidAmount":
      case "InvalidPriceIncrement":
      case "InvalidProduct":
      case "InsufficientFunds":
        return "red";
      default:
        return "blue";
    }
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
        <div class="header">
          <div class="ui compact secondary menu">
            <a class="active item" data-tab="orders">Orders</a>
            <a class="item" data-tab="trades">Trades</a>
          </div>
        </div>
        <div class="description">
          <div id="order-list" class="ui active tab" data-tab="orders">
            <table class="ui compact very basic fixed table">
              <thead>
                <tr>
                  <th class="three wide">Id</th>
                  <th class="two wide">Product</th>
                  <th class="one wide">Side</th>
                  <th class="one wide">Type</th>
                  <th class="two wide right aligned">Price</th>
                  <th class="two wide right aligned">Quantity</th>
                  <th class="two wide right aligned">Remaining</th>
                  <th class="two wide">Status</th>
                  <th class="three wide right aligned">Date</th>
                </tr>
              </thead>
            </table>
            <div class="scrollable content">
              <table class="ui compact very basic fixed table">
                <tbody>
                  {#each orders as order (order.id)}
                    <tr>
                      <td class="three wide">{order.id}</td>
                      <td class="two wide">{order.product_id}</td>
                      <td class="one wide">
                        <Side value={order.side} />
                      </td>
                      <td class="one wide">
                        <span
                          class:inverted={$theme === 'dark'}
                          class="ui horizontal blue label">
                          {#if (order.type = 'L')}Limit{:else}Market{/if}
                        </span>
                      </td>
                      <td class="two wide right aligned">
                        <span class="ui {color(order.side)} text">
                          {order.price.toFormat(2)}
                        </span>
                      </td>
                      <td class="two wide right aligned">
                        <FocusedNumber value={order.quantity} />
                      </td>
                      <td class="two wide right aligned">
                        <FocusedNumber value={order.remaining_quantity} />
                      </td>
                      <td
                        class="two wide"
                        data-tooltip="Test"
                        data-position="right center">
                        <span
                          class:inverted={$theme === 'dark'}
                          class="ui {computeColor(order.status_reason)}
                          horizontal label">
                          {computeStatusLabel(order.status, order.status_reason)}
                        </span>
                        {#if order.status_details}
                          <i
                            title={order.status_details}
                            class="question circle outline icon" />
                        {/if}
                      </td>
                      <td class="three wide right aligned">
                        <Date value={order.creation_date} format="ll LT" />
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
          <div id="trade-list" class="ui tab" data-tab="trades">
            <table class="ui compact very basic fixed table">
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
              <table class="ui compact very basic fixed table">
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
</div>
<Settings />