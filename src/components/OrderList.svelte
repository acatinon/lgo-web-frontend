<script>
import { orders } from "../stores/orders";
import Date from './Date.svelte';
import { get } from 'svelte/store';

let v = get(orders);
</script>
<div>

    {@debug orders}
    <ul>
    {#each Object.values($orders.openOrders) as { quantity, price, creation_date }, i}
        <li><Date value={creation_date}></Date> {quantity}: {price}</li>
    {/each}
    </ul>
</div>