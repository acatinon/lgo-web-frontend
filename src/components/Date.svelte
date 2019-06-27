<script>
import moment from "moment";
export let value;

const formatted = moment(value).format("LTS");

console.log("value: " + value);
console.log("formatted: " + formatted);
</script>

<span>{formatted}</span>