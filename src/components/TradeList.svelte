<script>
  import { trades } from "../stores/trades";
  import { orders } from "../stores/orders";
  import { onMount } from "svelte";
  import Date from "./Date.svelte";
  import Side from "./Side.svelte";
  import FromNow from "./FromNow.svelte";

  function color(side) {
    return side === "B" ? "green" : "red";
  }

  onMount(async () => {
    jQuery("#trades .menu .item").tab();
  });
</script>

<div>
  <div class="ui top attached tabular menu">
    <span class="active item" data-tab="latest">Latest trades</span>
    <span class="item" data-tab="my">My</span>
  </div>
  <div class="ui bottom attached active tab" data-tab="latest">
    <table class="ui very compact very basic small table">
      <thead>
        <tr>
          <th>Side</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {#each $trades as trade (trade.trade_id)}
          <tr>
            <td>
              <Side value={trade.side} />
            </td>
            <td>{trade.quantity}</td>
            <td>{trade.price}</td>
            <td>
              <Date value={trade.trade_creation_time} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="ui bottom attached tab" data-tab="my">
    <table class="ui very compact very basic small table">
      <thead>
        <tr>
          <th>Side</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Time</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each $orders.filledOrders as order (order.id)}
          <tr>
            <td>
              <Side value={order.side} />
            </td>
            <td>{order.quantity}</td>
            <td>{order.price}</td>
            <td>
              <FromNow value={order.creation_date} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
