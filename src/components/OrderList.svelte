<script>
  import { orders } from "../stores/orders";
  import { cancelOrder } from "../services/orders";
  import { onMount } from "svelte";
  import Side from "./Side.svelte";
  import FromNow from "./FromNow.svelte";

  function submitOrderCancellation(orderId) {
    cancelOrder(orderId);
  }

  onMount(async () => {
    jQuery("#orders .menu .item").tab();
  });
</script>

<div class="ui top attached tabular menu">
  <span class="active item" data-tab="open">Open orders</span>
  <span class="item" data-tab="filled">Filled orders</span>
</div>
<div class="ui bottom attached active tab" data-tab="open">
  <table class="ui very compact very basic small table">
    <thead>
      <tr>
        <th>Side</th>
        <th>Type</th>
        <th>Quantity (BTC)</th>
        <th>Price (USD)</th>
        <th>Remaining (BTC)</th>
        <th>Time</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each Object.values($orders.openOrders) as order (order.id)}
        <tr>
          <td><Side value={order.side} /></td>
          <td>{order.type}</td>
          <td>{order.quantity}</td>
          <td>{order.price}</td>
          <td>{order.remaining_quantity}</td>
          <td>
            <FromNow value={order.creation_date} />
          </td>
          <td>
            <a href="#" on:click|once={e => submitOrderCancellation(order.id)}>
              <i class="red times icon"></i>
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div class="ui bottom attached tab" data-tab="filled">
  <table class="ui very compact very basic small table">
    <thead>
      <tr>
        <th>Side</th>
        <th>Price (USD)</th>
        <th>Quantity (BTC)</th>
        <th>Time</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each Object.values($orders.filledOrders) as order (order.id)}
        <tr>
          <td><Side value={order.side} /></td>
          <td>{order.price}</td>
          <td>{order.quantity}</td>
          <td>
            <FromNow value={order.creation_date} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
