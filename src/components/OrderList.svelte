<script>
  import { orders } from "../stores/orders";
  import { cancelOrder } from "../services/orders";
  import { onMount } from "svelte";
  import Date from "./Date.svelte";

  function submitOrderCancellation(orderId) {
    cancelOrder(orderId);
  }

  onMount(async () => {
    jQuery(".menu .item").tab();
  });
</script>

<div class="ui top attached tabular menu">
  <a class="active item" data-tab="open">Open orders</a>
  <a class="item" data-tab="filled">Filled orders</a>
</div>
<div class="ui bottom attached active tab" data-tab="open">
  <table>
    {#each Object.values($orders.openOrders) as order (order.id)}
      <tr>
        <td>
          <Date value={order.creation_date} />
        </td>
        <td>{order.quantity}</td>
        <td>{order.price}</td>
        <td>
          <button on:click|once={e => submitOrderCancellation(order.id)}>
            Cancel
          </button>
        </td>
      </tr>
    {/each}
  </table>
</div>
<div class="ui bottom attached tab" data-tab="filled">
  <table>
    {#each Object.values($orders.filledOrders) as order (order.id)}
      <tr>
        <td>
          <Date value={order.creation_date} />
        </td>
        <td>{order.quantity}</td>
        <td>{order.price}</td>
        <td>{order.status}</td>
      </tr>
    {/each}
  </table>
</div>
