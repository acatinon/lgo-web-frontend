<script>
  import { trades } from "../stores/trades";
  import { orders } from "../stores/orders";
  import { onMount } from "svelte";
  import { color } from "../utils/ui";
  import Date from "./Date.svelte";
  import Side from "./Side.svelte";
  import FocusedNumber from "./FocusedNumber.svelte";

  onMount(async () => {
    jQuery("#trades .menu .item").tab();
  });
</script>

<div id="trades" class="block">
  <div class="ui pointing secondary menu">
    <div class="ui basic segment">
      <h5 class="item">Trades</h5>
    </div>
    <span class="active right item" data-tab="latest">Latest</span>
    <span class="item" data-tab="my">My</span>
  </div>
  <div class="ui bottom attached active tab content" data-tab="latest">
    <table class="ui three column very compact very basic small table">
      <thead>
        <tr>
          <th class="right aligned">Quantity</th>
          <th class="right aligned">Price</th>
          <th class="right aligned">Time</th>
          <th>&nbsp;&nbsp;&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {#each $trades as trade (trade.trade_id)}
          <tr>
            <td class="right aligned"><FocusedNumber value={trade.quantity.toFormat()} /></td>
            <td class="right aligned">
              <span class="ui {color(trade.side)} text">{trade.price.toFormat(2)}</span>
            </td>
            <td class="right aligned">
              <Date value={trade.creation_date} />
            </td>
            <td />
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="ui bottom attached tab content" data-tab="my">
    <table class="ui three column very compact very basic small table">
      <thead>
        <tr>
          <th class="right aligned">Quantity</th>
          <th class="right aligned">Price</th>
          <th class="right aligned">Time</th>
          <th>&nbsp;&nbsp;&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {#each $orders.filledOrders as order (order.id)}
          <tr>
            <td class="right aligned"><FocusedNumber value={order.quantity.toFormat()} /></td>
            <td class="right aligned">
              <span class="ui {color(order.side)} text">
                {order.price.toFormat(2)}
              </span>
            </td>
            <td class="right aligned">
              <Date value={order.creation_date} />
            </td>
            <td />
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>