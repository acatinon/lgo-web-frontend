<script>
  import { derived } from "svelte/store";
  import { orders } from "../stores/orders";
  import { currentProduct } from "../stores/products";
  import { cancelOrder } from "../services/orders";
  import { color, getBase, getQuote } from "../utils/ui";
  import Side from "./Side.svelte";
  import FromNow from "./FromNow.svelte";

  const sortbyCreationDate = (a, b) => b.creation_date.diff(a.creation_date);

  const sortedOrders = derived(orders, $orders =>
    $orders.openOrders.sort(sortbyCreationDate)
  );

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
<div id="orders" class="ui middle aligned divided list">
  {#each $sortedOrders as order (order.id)}
    <div class="item">
      <div class="right floated content">
        <button
          class="ui tertiary icon button"
          on:click|once={e => submitOrderCancellation(order.id)}>
          <i class="grey times icon" />
        </button>
      </div>
      <div class="content">
        <div class="header">
          {formatType(order.type)}
          <span class="ui {color(order.side)} text">
            {formatSide(order.side)}
          </span>
          @ {order.price}
        </div>
        {order.remaining_quantity} {getBase($currentProduct)} / {order.remaining_quantity.multipliedBy(order.price)}
        {getQuote($currentProduct)}
        <div class="extra">
          <span class="ui small disabled text">
            <FromNow value={order.creation_date} />
          </span>
        </div>
      </div>
    </div>
  {/each}
</div>
