<script>
  import { onMount } from "svelte";

  onMount(async () => {
    jQuery("#theme-switcher").dropdown({
      values: [
        {
          name: "Light",
          value: "light",
          selected: true
        },
        {
          name: "Dark",
          value: "dark"
        }
      ],
      onChange: function(value, text) {
        switch (value) {
          case "light":
            jQuery("body").removeClass("dark");
            jQuery(".ui").removeClass("inverted");
            break;
          case "dark":
            jQuery("body").addClass("dark");
            jQuery(".ui").addClass("inverted");
            break;
        }
      }
    });
  });
</script>

<div id="settings-modal" class="ui modal">
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
