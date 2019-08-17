<script>
  import { onMount } from "svelte";
  import { setTheme, themes } from "../utils/ui";
  import { theme } from "../stores/settings";

  onMount(async () => {
    jQuery("#settings-modal").modal({
      autofocus: false
    });

    jQuery("#theme-switcher").dropdown({
      values: themes.map(t => {
        return { name: t.name, value: t.value, selected: t.value === $theme };
      }),
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
        <div id="theme-switcher" class="ui selection dropdown">
          <div class="text" />
          <i class="dropdown icon" />
        </div>
      </div>
    </div>
  </div>
  <div class="actions">
    <div class="ui positive button">Save</div>
  </div>
</div>
