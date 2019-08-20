<script>
  import "fomantic-ui-less/semantic.less";
  import "./js/semantic.js";
  import { onMount } from "svelte";
  import { setTheme } from "./utils/ui";
  import { theme } from "./stores/settings";
  import Menu from "./components/Menu.svelte";

   onMount(async () => {
    setTheme($theme);
   });

</script>

<div id="site">
  <Menu activePage="wallets">
    <span class="item">Wallets</span>
  </Menu>
  <div class="ui container">
    <div class="ui fluid card">
      <div class="title content">
        <h3 class="header">Wallets</h3>
      </div>
      <div class="content">
        <p class="ui basic segment">Bla bla</p>
      </div>
    </div>
  </div>
</div>