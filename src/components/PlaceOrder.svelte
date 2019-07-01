<script>
import { placeOrder } from "../services/orders"

function submitOrder() {
    placeOrder("BTC-USD", "L", "B", 10, 6970);
}

</script>

<form on:submit|preventDefault={submitOrder}>
    <input name="quantity" type="text" />
    <input name="price" type="text" />

    <input type="submit" />
</form>