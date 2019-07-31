<script>
  import { orders } from "../stores/orders";
  import { currentProduct } from "../stores/products";
  import { cancelOrder } from "../services/orders";
  import { color } from "../utils/ui"
  import Side from "./Side.svelte";
  import FromNow from "./FromNow.svelte";

  function submitOrderCancellation(orderId) {
    cancelOrder(orderId);
  }

  function formatSide(side) {
    return side === "B" ? "buy" : "sell";
  }

  function formatType(type) {
    return type === "L" ? "Limit" : "Market";
  }
</script>

<h5 class="ui dividing header">Open orders</h5>
<div class="ui middle aligned divided list">
  {#each $orders.openOrders as order (order.id)}
    <div class="item">
      <div class="right floated content">
        <FromNow value={order.creation_date} />
        <button
          class="ui tertiary icon button"
          on:click|once={e => submitOrderCancellation(order.id)}>
          <i class="grey times icon" />
        </button>
      </div>
      <div class="content">
         <div class="header">{formatType(order.type)} <span class="ui {color(order.side)} text">{formatSide(order.side)}</span> @ {order.price}</div> 
         {order.remaining_quantity} {currentProduct.getBase()} / {order.remaining_quantity.multipliedBy(order.price)} {currentProduct.getQuote()}
        
      </div>
    </div>
  {/each}
</div>
