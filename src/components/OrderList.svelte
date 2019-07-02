<script>
import { orders } from "../stores/orders";
import { cancelOrder } from "../services/orders";
import Date from './Date.svelte';
import { get } from 'svelte/store';

function submitOrderCancellation(orderId) {
    cancelOrder(orderId);
}

</script>

<div>
    <h3>Open orders</h3>
    <table>
    {#each Object.values($orders.openOrders) as order (order.id)}
        <tr>
            <td><Date value={order.creation_date} /></td>
            <td>{order.quantity}</td>
            <td>{order.price}</td>
            <td><button on:click|once={e => submitOrderCancellation(order.id)}>Cancel</button></td>
        </tr>
    {/each}
    </table>
</div>
<div>
    <h3>Closed orders</h3>
    <table>
    {#each Object.values($orders.closedOrders) as order (order.id)}
        <tr>
            <td><Date value={order.creation_date} /></td>
            <td>{order.quantity}</td>
            <td>{order.price}</td>
            <td>{order.status}</td>
        </tr>
    {/each}
    </table>
</div>