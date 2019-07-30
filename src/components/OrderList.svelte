<script>
  import { orders } from "../stores/orders";
  import { cancelOrder } from "../services/orders";
  import Side from "./Side.svelte";
  import FromNow from "./FromNow.svelte";

  function submitOrderCancellation(orderId) {
    cancelOrder(orderId);
  }

</script>

<h5 class="ui dividing header">Open orders</h5>
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
    {#each $orders.openOrders as order (order.id)}
      <tr>
        <td>
          <Side value={order.side} />
        </td>
        <td>{order.type}</td>
        <td>{order.quantity}</td>
        <td>{order.price}</td>
        <td>{order.remaining_quantity}</td>
        <td>
          <FromNow value={order.creation_date} />
        </td>
        <td>
          <a href="#" on:click|once={e => submitOrderCancellation(order.id)}>
            <i class="red times icon" />
          </a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
