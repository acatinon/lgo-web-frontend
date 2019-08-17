<script>
  import { products, currentProduct } from "../stores/products";
  import { balances } from "../stores/balances";
  import { getBase, getQuote } from "../utils/ui";
  import { derived } from "svelte/store";
  import { onMount } from "svelte";

  const baseAmount = derived(
    [currentProduct, balances],
    ([$currentProduct, $balances]) =>
      $currentProduct ? $balances[getBase($currentProduct)] : undefined
  );
  const quoteAmount = derived(
    [currentProduct, balances],
    ([$currentProduct, $balances]) =>
      $currentProduct ? $balances[getQuote($currentProduct)] : undefined
  );

  onMount(async () => {
    jQuery("#product-selector").dropdown();

    jQuery("#settings").click(async () => {
      jQuery("#settings-modal").modal('show');
    });
  });
</script>

<div id="menu" class="ui menu">
  <div id="product-selector" class="ui compact selection dropdown item">
    <input type="hidden" name="product" bind:value={$currentProduct} />
    <i class="dropdown icon" />
    <div class="text">{$currentProduct}</div>
    <div class="menu">
      {#each $products as product}
        <div class="item" data-value={product.id}>{product.id}</div>
      {/each}
    </div>
  </div>
  <div class="item">
    Balance:
    <span class="ui basic purple horizontal label">
      {getBase($currentProduct)}
      <div class="detail">
        {#if $baseAmount}{$baseAmount.available.toFormat()}{/if}
      </div>
    </span>
    <span class="ui basic purple horizontal label">
      {getQuote($currentProduct)}
      <div class="detail">
        {#if $quoteAmount}{$quoteAmount.available.toFormat()}{/if}
      </div>
    </span>
  </div>
  <div class="item">
    Available:
    <span class="ui basic teal horizontal label">
      {getBase($currentProduct)}
      <div class="detail">
        {#if $baseAmount}
          {$baseAmount.available.minus($baseAmount.escrowed).toFormat()}
        {/if}
      </div>
    </span>
    <span class="ui basic teal horizontal label">
      {getQuote($currentProduct)}
      <div class="detail">
        {#if $quoteAmount}
          {$quoteAmount.available.minus($quoteAmount.escrowed).toFormat()}
        {/if}
      </div>
    </span>
  </div>
  <div class="right menu">
    <a class="item" href="account.html">Account</a>
    <a id="settings" class="item" href="#">
      <i class="sliders horizontal icon" />
    </a>
  </div>
</div>
