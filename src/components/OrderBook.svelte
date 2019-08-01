<script>
  import { orderBook } from "../stores/order_book";
  import { derived } from "svelte/store";
  import { color } from "../utils/ui";
  import BigNumber from "bignumber.js";

  let a = new BigNumber(12);
  let b = new BigNumber(12);

  const sortNumber = (a, b) => a.comparedTo(b);
  const sortNumberReverse = (a, b) => b.comparedTo(a);

  const sortedAsks = derived(orderBook, $orderBook =>
    Array.from($orderBook.asks.keys()).sort(sortNumber)
  );
  const sortedBids = derived(orderBook, $orderBook =>
    Array.from($orderBook.bids.keys()).sort(sortNumberReverse)
  );

  const combined = derived(
    [sortedAsks, sortedBids],
    ([$sortedAsks, $sortedBids]) => {
      const comb = [];
      let askSum = new BigNumber(0);
      let bidSum = new BigNumber(0);
      const size = Math.max($sortedAsks.length, $sortedBids.length);
      for (let i = 0; i < size; i++) {
        const item = { index: i };
        item.ask = $sortedAsks[i];
        if (item.ask) {
          item.askQuantity = $orderBook.asks.get(item.ask);
          item.askValue = item.ask.multipliedBy(item.askQuantity);
          item.askSum = askSum = askSum.plus(item.askValue);
        }

        item.bid = $sortedBids[i];
        if (item.bid) {
          item.bidQuantity = $orderBook.bids.get(item.bid);
          item.bidValue = item.bid.multipliedBy(item.bidQuantity);
          item.bidSum = bidSum = bidSum.plus(item.askValue);
        }

        comb.push(item);
      }
      return comb;
    }
  );
</script>

<table class="ui very compact very basic small table">
  <thead>
    <tr>
      <th class="two wide right aligned">Sum</th>
      <th class="two wide right aligned">Value</th>
      <th class="one wide right aligned">Quantity</th>
      <th class="one wide right aligned">Bid</th>
      <th class="one wide">Ask</th>
      <th class="one wide right aligned">Quantity</th>
      <th class="two wide right aligned">Value</th>
      <th class="two wide right aligned">Sum</th>
    </tr>
  </thead>
  <tbody>
    {#each $combined as c (c.index)}
      <tr>
        <td class="right aligned">{c.bidSum || ''}</td>
        <td class="right aligned">{c.bidValue || ''}</td>
        <td class="right aligned">{c.bidQuantity || ''}</td>
        <td class="right aligned">
          <span class="ui {color('B')} text">{c.bid || ''}</span>
        </td>
        <td>
          <span class="ui {color('S')} text">{c.ask || ''}</span>
        </td>
        <td class="right aligned">{c.askQuantity || ''}</td>
        <td class="right aligned">{c.askValue || ''}</td>
        <td class="right aligned">{c.askSum || ''}</td>
      </tr>
    {/each}
  </tbody>
</table>
