<script>
  import { onMount } from "svelte";

  export let activePage;

  onMount(async () => {
    jQuery("#settings").click(async () => {
      jQuery("#settings-modal").modal('show');
    });
  });
</script>

<div id="menu" class="ui menu">
  <slot></slot>
  <div class="ui right secondary menu segment">
    <a class="item" class:active="{activePage === 'wallets'}" href="wallets.html">Wallets</a>
    <a class="item" class:active="{activePage === 'history'}" href="history.html">History</a>
    <a class="item" class:active="{activePage === 'exchange'}" href="exchange.html">Exchange</a>
    <a id="settings" class="item" href="#">
      <i class="sliders horizontal icon" />
    </a>
  </div>
</div>
