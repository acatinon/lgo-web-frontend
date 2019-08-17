<script>
  import { onMount } from "svelte";

  onMount(async () => {
    jQuery("#settings").click(async () => {
      jQuery("#settings-modal").modal('show');
    });
  });
</script>

<div id="menu" class="ui menu">
  <slot></slot>
  <div class="ui right secondary menu">
    <a class="item" href="wallets.html">Wallets</a>
    <a class="item" href="history.html">History</a>
    <a class="active item" href="exchange.html">Exchange</a>
    <a id="settings" class="item" href="#">
      <i class="sliders horizontal icon" />
    </a>
  </div>
</div>
