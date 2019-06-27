<script>
import { getOrders } from "../services/orders";
import Date from './Date.svelte';

let orders = getOrders("BTC-USD");
</script>

<div>
{#await orders}
    <p>Loading...</p>
{:then response}
    <ul>
    {#each response.body.result.orders as { quantity, price, creation_date }, i}
        <li><Date value={creation_date}></Date> {quantity}: {price}</li>
    {/each}
    </ul>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
</div>