<script>
  import { products, currentProduct } from "../stores/products";
  import { balances } from "../stores/balances";
  import { derived } from "svelte/store";

  const baseAmount = derived(
    [currentProduct, balances],
    ([$currentProduct, $balances]) => $balances[$currentProduct.base.id] || 0
  );
  const quoteAmount = derived(
    [currentProduct, balances],
    ([$currentProduct, $balances]) => $balances[$currentProduct.quote.id] || 0
  );
</script>

<div>
  <select bind:value={$currentProduct}>
    {#each $products as product}
      <option value={product}>{product.id}</option>
    {/each}
  </select>
</div>
<div>Base amount: {baseAmount}</div>
<div>Quote amount: {quoteAmount}</div>
