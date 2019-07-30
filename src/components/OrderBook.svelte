<script>
  import { orderBook } from "../stores/order_book";
  import { derived } from "svelte/store";
  import BigNumber from "bignumber.js";

  let a = new BigNumber(12);
  let b = new BigNumber(12);

  const sortNumber = (a, b) => b.comparedTo(a);

  const sortedPrices = derived(orderBook, $orderBook => [
    ...Array.from($orderBook.asks.keys()).sort(sortNumber),
    ...Array.from($orderBook.bids.keys()).sort(sortNumber)
  ]);

  const combined = derived(orderBook, $orderBook => {
    return new Map([...$orderBook.asks, ...$orderBook.bids]);
  });

  function color(price) {
    if (price.isGreaterThanOrEqualTo($orderBook.minAsk)) {
      return "red";
    } else if (price.isLessThanOrEqualTo($orderBook.maxBid)) {
      return "green";
    } else {
      return "";
    }
  }
</script>

<table class="ui very compact very basic fixed small table">
  <thead>
    <tr>
      <th class="right aligned">Quantity</th>
      <th class="right aligned">Price</th>
    </tr>
  </thead>
  <tbody>
    {#each $sortedPrices as price (price)}
      <tr>
        <td class="right aligned">{$combined.get(price).toFormat(4)}</td>
        <td class="right aligned">
          <span class="ui {color(price)} text">{price.toFormat(8)}</span>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
