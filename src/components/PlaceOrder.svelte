<script>
import { placeOrder } from "../services/orders";
import { Side, OrderType } from "../domain/order";

let side;
let type;
let quantity;
let price;

function submitOrder() {
    placeOrder("BTC-USD", type, side, quantity, price);
}
</script>

<form on:submit|preventDefault={submitOrder}>

    <select name="type" bind:value="{type}">
        <option value="M">Market</option>
        <option value="L">Limit</option>
    </select>

    <input name="quantity" type="number" min="0" bind:value="{quantity}" />
    
    <input name="price" type="number" min="0" bind:value="{price}" />

    <input type="submit" />
</form>