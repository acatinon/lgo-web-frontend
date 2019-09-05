<script>
import { theme } from "../stores/settings";

export let value;

const formatted = value === "B" ? "Buy" : "Sell";
const color = value === "B" ? "green" : "red";

</script>

<span class:inverted="{$theme === "dark"}" class="ui horizontal {color} label">{formatted}</span>