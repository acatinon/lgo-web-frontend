<script>
  import { trades } from "../stores/trades";
  import { orders } from "../stores/orders";
  import { onMount } from "svelte";
  import { color } from "../utils/ui";
  import Date from "./Date.svelte";
  import Side from "./Side.svelte";

  onMount(async () => {
    jQuery("#trades .menu .item").tab();
  });
</script>

<div class="ui pointing secondary menu">
  <h5 class="item">Trades</h5>
  <span class="active right item" data-tab="latest">Latest</span>
  <span class="item" data-tab="my">My</span>
</div>
<div class="ui bottom attached active tab" data-tab="latest">
  <table class="ui three column very compact very basic small table">
    <thead>
      <tr>
        <th class="right aligned">Quantity</th>
        <th class="right aligned">Price</th>
        <th class="right aligned">Time</th>
      </tr>
    </thead>
    <tbody>
      {#each $trades as trade (trade.trade_id)}
        <tr>
          <td class="right aligned">{trade.quantity}</td>
          <td class="right aligned">
            <span class="ui {color(trade.side)} text">{trade.price}</span>
          </td>
          <td class="right aligned">
            <Date value={trade.trade_creation_time} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div class="ui bottom attached tab" data-tab="my">
  <table class="ui three column very compact very basic small table">
    <thead>
      <tr>
        <th class="right aligned">Quantity</th>
        <th class="right aligned">Price</th>
        <th class="right aligned">Time</th>
      </tr>
    </thead>
    <tbody>
      {#each $orders.filledOrders as order (order.id)}
        <tr>
          <td class="right aligned">{order.quantity.toFormat(8)}</td>
          <td class="right aligned">
            <span class="ui {color(order.side)} text">
              {order.price.toFormat(4)}
            </span>
          </td>
          <td class="right aligned">
            <Date value={order.creation_date} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
