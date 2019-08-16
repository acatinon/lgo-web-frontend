<script>
  import { trades } from "../stores/trades";
  import { orders } from "../stores/orders";
  import { onMount } from "svelte";
  import { color } from "../utils/ui";
  import Date from "./Date.svelte";
  import Side from "./Side.svelte";
  import FocusedNumber from "./FocusedNumber.svelte";

  onMount(async () => {
    jQuery("#trades .menu .item").tab();
    //jQuery("#trades table").floatThead();
  });
</script>

<div id="trades" class="block">
  <div class="ui pointing secondary menu">
    <div class="ui basic segment">
      <h5 class="item">Trades</h5>
    </div>
    <span class="active right item" data-tab="latest">Latest</span>
    <span class="item" data-tab="my">My</span>
  </div>
  <table class="ui very compact very basic small table">
    <thead>
      <tr>
        <th class="five wide right aligned">Quantity</th>
        <th class="five wide right aligned">Price</th>
        <th class="five wide right aligned">Time</th>
        <th class="one wide">&nbsp;&nbsp;&nbsp;</th>
      </tr>
    </thead>
  </table>
  <div class="content">
    <div class="ui bottom attached active tab" data-tab="latest">
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
    <div class="ui bottom attached tab content" data-tab="my">
      <table class="ui very compact very basic small table">
        <tbody>
          {#each $orders.filledOrders as order (order.id)}
            <tr>
              <td class="five wide right aligned">
                <FocusedNumber value={order.quantity} />
              </td>
              <td class="five wide right aligned">
                <span class="ui {color(order.side)} text">
                  {order.price.toFormat(2)}
                </span>
              </td>
              <td class="five wide right aligned">
                <Date value={order.creation_date} />
              </td>
              <td class="one wide" />
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
