<script>
export let value;

const formatted = value === "B" ? "Buy" : "Sell";
const color = value === "B" ? "green" : "red";

</script>

<span class="ui horizontal {color} label">{formatted}</span>