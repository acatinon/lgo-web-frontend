<script>
  import { onMount } from "svelte";
  import { setTheme } from "../utils/ui";
  import { theme } from "../stores/settings";

  onMount(async () => {
    jQuery("#theme-switcher").dropdown({
      values: [
        {
          name: "Light",
          value: "light"/*,
          selected: true*/
        },
        {
          name: "Dark",
          value: "dark"
        }
      ],
      onChange: function(value, text) {
        theme.set(value);
      }
    });
  });
</script>

<div id="settings-modal" class="ui modal block">
  <div class="header">Settings</div>
  <div class="content">
    <div class="ui form">
      <div class="field">
        <label>Theme</label>
        <div id="theme-switcher" class="ui compact selection dropdown">
          <div class="text" />
          <i class="dropdown icon" />
        </div>
      </div>
    </div>
  </div>
</div>
