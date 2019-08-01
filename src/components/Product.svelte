<script>
  import { products, currentProduct } from "../stores/products";
  import { balances } from "../stores/balances";
  import { derived } from "svelte/store";
  import { onMount } from "svelte";

  const baseAmount = derived(
    [currentProduct, balances],
    ([$currentProduct, $balances]) =>
      $currentProduct ? $balances[currentProduct.getBase()] : undefined
  );
  const quoteAmount = derived(
    [currentProduct, balances],
    ([$currentProduct, $balances]) =>
      $currentProduct ? $balances[currentProduct.getQuote()] : undefined
  );

  onMount(async () => {
    jQuery("#product-selector").dropdown();
  });
</script>

<div id="product">
  <div id="product-selector" class="ui huge fluid selection dropdown">
    <input type="hidden" name="product" bind:value={$currentProduct} />
    <i class="dropdown icon" />
    <div class="text">{$currentProduct}</div>
    <div class="menu">
      {#each $products as product}
        <div class="item" data-value={product.id}>{product.id}</div>
      {/each}
    </div>
  </div>

</div>
<h5 class="ui dividing header">Available balance</h5>
<div class="ui list">
  {#if $baseAmount}
    <div class="item">
      <div class="ui basic blue horizontal label">BTC</div>
      {$baseAmount.available.toFormat()}
    </div>
  {/if}
  {#if $quoteAmount}
    <div class="item">
      <div class="ui basic blue horizontal label">USD</div>
      {$quoteAmount.available.toFormat()}
    </div>
  {/if}
</div>
