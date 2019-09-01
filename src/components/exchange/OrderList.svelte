<script>
  import { derived } from "svelte/store";
  import { orders } from "../../stores/orders";
  import { currentProduct } from "../../stores/products";
  import { cancelOrder } from "../../services/orders";
  import { color, getBase, getQuote } from "../../utils/ui";
  import Side from "../Side.svelte";
  import FromNow from "../FromNow.svelte";

  const sortbyCreationDate = (a, b) => b.creation_date.diff(a.creation_date);

  const sortedOrders = derived(orders, $orders =>
    $orders.sort(sortbyCreationDate)
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

<div id="orders" class="ui fluid card">
  <div class="ui title secondary menu">
    <h5 class="ui header item">Open orders</h5>
  </div>
  <div class="scrollable filled content">
    <div class="ui middle aligned divided list">
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
              <span class="ui {color(order.side)} text">
                {formatType(order.type)} {formatSide(order.side)}
              </span>
              <span class="ui grey text">@</span>
              {order.price.toFormat()}
              <span class="ui grey text">{getQuote($currentProduct)}</span>
            </div>
            {order.remaining_quantity.toFormat()}
            <span class="ui grey text">{getBase($currentProduct)}</span>
            / {order.remaining_quantity.multipliedBy(order.price).toFormat()}
            <span class="ui grey text">{getQuote($currentProduct)}</span>
            <div class="extra">
              <span class="ui small disabled text">
                <FromNow value={order.creation_date} />
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
