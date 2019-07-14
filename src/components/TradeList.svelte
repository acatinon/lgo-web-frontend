<script>
  import { trades } from "../stores/trades";
  import Date from "./Date.svelte";
  import Side from "./Side.svelte";

  function color(side) {
    return side === "B" ? "green" : "red";
  }


</script>

<div>
  <h5 class="ui dividing header">Trades</h5>
  <table class="ui very compact very basic small table">
    <thead>
      <tr>
        <th>Side</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {#each $trades as trade (trade.trade_id)}
        <tr>
          <td><Side value={trade.side} /></td>
          <td>{trade.quantity}</td>
          <td>{trade.price}</td>
          <td>
            <Date value={trade.trade_creation_time} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
