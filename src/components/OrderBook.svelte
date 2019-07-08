<script>
  import { orderBook } from "../stores/order_book";
  import { derived } from "svelte/store";

  const sortedPrices = derived(
    orderBook,
    ($orderBook) => [ ...Object.keys($orderBook.bids).sort(), ...Object.keys($orderBook.asks).sort() ]
  );

  const combined = derived(
    orderBook,
    ($orderBook) => { return { ...$orderBook.bids, ...$orderBook.asks } }
  );

</script>

<div>
    <ul>
    {#each $sortedPrices as price}
        <li>{price}: {$combined[price]}</li>
    {/each}
    </ul>
</div>