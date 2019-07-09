<script>
  import { orderBook } from "../stores/order_book";
  import { derived } from "svelte/store";

  const sortNumber = (a, b) => b - a;

  const sortedPrices = derived(
    orderBook,
    ($orderBook) => [ ...Object.keys($orderBook.asks).map(x => parseFloat(x)).sort(sortNumber), ...Object.keys($orderBook.bids).map(x => parseFloat(x)).sort(sortNumber) ]
  );

  const combined = derived(
    orderBook,
    ($orderBook) => { return { ...$orderBook.asks, ...$orderBook.bids } }
  );

  function color(price) {
    if (price > $orderBook.minAsk) {
      return "red";
    }
    else if (price < $orderBook.maxBid) {
      return "green";
    }
    else {
      return "";
    }
  }

</script>

<table class="ui very compact very basic small table">
  <thead>
    <tr>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
  {#each $sortedPrices as price}
    <tr>
      <td>{$combined[price]}</td>
      <td><span class="ui {color(price)} text">{price}</span></td>
    </tr>
    {/each}
  </tbody>
</table>
