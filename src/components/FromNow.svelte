<script>
import moment from "moment";
export let value;

const formatted = moment(value).fromNow();

</script>

<span>{formatted}</span>