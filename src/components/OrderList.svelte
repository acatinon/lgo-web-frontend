<script>
import { getOrders } from "../services/orders";

let orders = getOrders("BTC-USD");
</script>

<div>
{#await orders}
    <p>Loading...</p>
{:then response}
    <ul>
    {#each response.body.result.orders as { quantity, price }, i}
        <li>{quantity}: {price}</li>
    {/each}
    </ul>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
</div>