<script>
  import { trades } from "../../stores/trades";
  import { orders } from "../../stores/orders";
  import { onMount } from "svelte";
  import { color } from "../../utils/ui";
  import Date from "../Date.svelte";
  import Side from "../Side.svelte";
  import FocusedNumber from "../FocusedNumber.svelte";
</script>

<div id="trades" class="ui fluid card">
  <div class="ui secondary menu">
    <h5 class="ui header item">Latest trades</h5>
  </div>
  <table class="ui very compact very basic small filled content table">
    <thead>
      <tr>
        <th class="five wide right aligned">Quantity</th>
        <th class="five wide right aligned">Price</th>
        <th class="five wide right aligned">Time</th>
        <th class="one wide">&nbsp;</th>
      </tr>
    </thead>
  </table>
  <div class="filled scrollable content">
    <table class="ui very compact very basic small table">
      <tbody>
        {#each $trades as trade (trade.id)}
          <tr>
            <td class="five wide right aligned">
              <FocusedNumber value={trade.quantity} />
            </td>
            <td class="five wide right aligned">
              <span class="ui {color(trade.side)} text">
                {trade.price.toFormat(2)}
              </span>
            </td>
            <td class="five wide right aligned">
              <Date value={trade.creation_date} />
            </td>
            <td class="one wide" />
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
