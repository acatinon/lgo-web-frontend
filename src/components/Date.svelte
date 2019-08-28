<script>
import moment from "moment";
export let value;
export let format = "LTS"

const formatted = moment(value).format(format);

</script>

<span>{formatted}</span>