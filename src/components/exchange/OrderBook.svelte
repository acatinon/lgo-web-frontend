<script>
  import { orderBook } from "../../stores/order_book";
  import { currentBase, currentQuote } from "../../stores/currencies";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { color } from "../../utils/ui";
  import BigNumber from "bignumber.js";
  import FocusedNumber from "../FocusedNumber.svelte";

  let a = new BigNumber(12);
  let b = new BigNumber(12);
  let isFloatTheadInitialized = false;

  const sortNumber = (a, b) => a.comparedTo(b);
  const sortNumberReverse = (a, b) => b.comparedTo(a);

  const sortedAsks = derived(orderBook, $orderBook =>
    Array.from($orderBook.asks.keys()).sort(sortNumber)
  );
  const sortedBids = derived(orderBook, $orderBook =>
    Array.from($orderBook.bids.keys()).sort(sortNumberReverse)
  );

  const minAsk = derived(orderBook, $orderBook =>
    BigNumber.min(...$orderBook.asks.keys())
  );
  const maxBid = derived(orderBook, $orderBook =>
    BigNumber.max(...$orderBook.bids.keys())
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

  console.log(JSON.stringify($currentBase));
</script>

<div id="orderbook" class="ui fluid card">
  <div class="ui title secondary menu">
    <h5 class="ui header item">Order book</h5>
    <span class="right item">
      <span class="ui disabled text">Spread:</span>
      &nbsp;{$minAsk.minus($maxBid).toFormat(currentQuote.scale)}
    </span>
  </div>
  <div class="filled book-header content">
    <table class="book-bids ui very compact very basic small column table">
      <thead>
        <tr>
          <th class="five wide right aligned">Sum</th>
          <th class="five wide right aligned">Value</th>
          <th class="five wide right aligned">Quantity</th>
          <th class="one wide" />
        </tr>
      </thead>
    </table>
    <table class="book-amounts ui very compact very basic small column table">
      <thead>
        <tr>
          <th class="seven wide right aligned">Bid</th>
          <th class="two wide" />
          <th class="seven wide right aligned">Ask</th>
        </tr>
      </thead>
    </table>
    <table class="book-asks ui very compact very basic small column table">
      <thead>
        <tr>
          <th class="five wide right aligned">Quantity</th>
          <th class="five wide right aligned">Value</th>
          <th class="five wide right aligned">Sum</th>
          <th class="one wide" />
        </tr>
      </thead>
    </table>
  </div>
  <div class="filled scrollable content">
    <div class="book-content">
      <table class="book-bids ui very compact very basic small column table">
        <tbody>
          {#each $combined as c (c.index)}
            <tr>
              <td class="five wide right aligned">
                {c.bidSum ? c.bidSum.toFormat($currentQuote.scale) : ' '}&nbsp;
              </td>
              <td class="five wide right aligned">
                {c.bidValue ? c.bidValue.toFormat($currentQuote.scale) : ' '}
              </td>
              <td class="five wide right aligned">
                <FocusedNumber value={c.bidQuantity} scale={$currentBase.scale} />
              </td>
              <td class="one wide" />
            </tr>
          {/each}
        </tbody>
      </table>
      <table class="book-amounts ui very compact very basic small column table">
        <tbody>
          {#each $combined as c (c.index)}
            <tr>
              <td class="seven wide right aligned">
                <span class="ui {color('B')} text">
                  {c.bid ? c.bid.toFormat($currentQuote.scale) : ''}
                </span>
              </td>
              <td class="two wide" />
              <td class="seven wide right aligned">
                <span class="ui {color('S')} text">
                  {c.ask ? c.ask.toFormat($currentQuote.scale) : ''}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <table class="book-asks ui very compact very basic small column table">
        <tbody>
          {#each $combined as c (c.index)}
            <tr>
              <td class="five wide right aligned">
                <FocusedNumber value={c.askQuantity} scale={$currentBase.scale} />
              </td>
              <td class="five wide right aligned">
                {c.askValue ? c.askValue.toFormat($currentQuote.scale) : ' '}
              </td>
              <td class="five wide right aligned">
                {c.askSum ? c.askSum.toFormat($currentQuote.scale) : ' '}&nbsp;
              </td>
              <td class="one wide" />
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
