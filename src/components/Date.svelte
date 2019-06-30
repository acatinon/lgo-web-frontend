<script>
import moment from "moment";
export let value;

const formatted = moment(value).format("LTS");

</script>

<span>{formatted}</span>