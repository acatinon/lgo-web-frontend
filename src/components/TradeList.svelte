<script>
  import { trades } from "../stores/trades";
  import Date from "./Date.svelte";
</script>

<div>
  <h3>Trades</h3>
  <table>
    {#each $trades as trade (trade.trade_id)}
      <tr>
        <td>
          <Date value={trade.trade_creation_time} />
        </td>
        <td>{trade.quantity}</td>
        <td>{trade.price}</td>
        <td>{trade.side}</td>
      </tr>
    {/each}
  </table>
</div>
