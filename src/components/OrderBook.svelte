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
          item.bidSum = bidSum = bidSum.plus(item.bidValue);
        }

        comb.push(item);
      }
      return comb;
    }
  );
</script>

<div class="ui right floated basic segment">Spread: {$orderBook.maxBid.minus($orderBook.minAsk).toFormat(2)}</div>
<div class="ui basic segment">
  <h5 class="ui header">Order book</h5>
</div>
<div class="ui clearing divider"></div>
<div class="content">
  <div class="inner">
    <div id="bids">
      <table class="ui very compact very basic small five wide column table">
        <thead>
          <tr>
            <th class="five wide right aligned">Sum</th>
            <th class="five wide right aligned">Value</th>
            <th class="five wide right aligned">Quantity</th>
            <th class="one wide" />
          </tr>
        </thead>
        <tbody>
          {#each $combined as c (c.index)}
            <tr>
              <td class="right aligned">
                {c.bidSum ? c.bidSum.toFormat(2) : ' '}&nbsp;
              </td>
              <td class="right aligned">
                {c.bidValue ? c.bidValue.toFormat(2) : ' '}
              </td>
              <td class="right aligned">
                {c.bidQuantity ? c.bidQuantity.toFormat(8) : ' '}
              </td>
              <td />
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div id="book">
      <table class="ui very compact very basic small two wide column table">
        <thead>
          <tr>
            <th class="right aligned">Bid</th>
            <th />
            <th class="right aligned">Ask</th>
          </tr>
        </thead>
        <tbody>
          {#each $combined as c (c.index)}
            <tr>
              <td class="right aligned">
                <span class="ui {color('B')} text">
                  {c.bid ? c.bid.toFormat(2) : ''}
                </span>
              </td>
              <td />
              <td class="right aligned">
                <span class="ui {color('S')} text">
                  {c.ask ? c.ask.toFormat(2) : ''}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div id="asks">
      <table class="ui very compact very basic small five wide column table">
        <thead>
          <tr>
            <th class="five wide right aligned">Quantity</th>
            <th class="five wide right aligned">Value</th>
            <th class="five wide right aligned">Sum</th>
            <th class="one wide" />
          </tr>
        </thead>
        <tbody>
          {#each $combined as c (c.index)}
            <tr>
              <td class="right aligned">
                {c.askQuantity ? c.askQuantity.toFormat(8) : ' '}
              </td>
              <td class="right aligned">
                {c.askValue ? c.askValue.toFormat(2) : ' '}
              </td>
              <td class="right aligned">
                {c.askSum ? c.askSum.toFormat(2) : ' '}&nbsp;
              </td>
              <td />
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
