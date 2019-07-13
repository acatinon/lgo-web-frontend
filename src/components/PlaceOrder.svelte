<script>
  import { placeOrder } from "../services/orders";
  import { Side, OrderType } from "../domain/order";

  let side;
  let type;
  let quantity;
  let price;

  function selectBuy() {
    jQuery("#buy-tab").addClass("active");
    jQuery("#sell-tab").removeClass("active");
    jQuery("#submit-order")
      .addClass("green")
      .removeClass("red")
      .text("Buy");
  }

  function selectSell() {
    jQuery("#sell-tab").addClass("active");
    jQuery("#buy-tab").removeClass("active");
    jQuery("#submit-order")
      .addClass("red")
      .removeClass("green")
      .text("Sell");
  }

  function selectMarket() {
    jQuery("#market-button").addClass("active blue");
    jQuery("#limit-button").removeClass("active blue");
    jQuery("#quantity-field").hide();
  }

  function selectLimit() {
    jQuery("#limit-button").addClass("active blue");
    jQuery("#market-button").removeClass("active blue");
    jQuery("#quantity-field").show();
  }

  function submitOrder() {
    placeOrder("BTC-USD", type, side, quantity, price);
  }
</script>

<form class="ui form" on:submit|preventDefault={submitOrder}>

  <div class="field">
    <div class="ui top attached tabular menu">
      <span id="buy-tab" class="active item" on:click={selectBuy}>Buy</span>
      <span id="sell-tab" class="item" on:click={selectSell}>Sell</span>
    </div>
  </div>

  <div class="field">
    <div class="ui fluid buttons">
      <button id="market-button" class="ui button" on:click|preventDefault={selectMarket}>
        Market
      </button>
      <button
        id="limit-button"
        class="ui active blue button"
        on:click|preventDefault={selectLimit}>
        Limit
      </button>
    </div>
  </div>

  <div id="quantity-field" class="field">
    <label>Quantity</label>
    <div class="ui fluid labeled input">
      <div class="ui basic label"><span class="ui grey text">BTC</span></div>
      <input name="quantity" type="number" min="0" bind:value={quantity} />
    </div>
  </div>

  <div class="field">
    <label>Price</label>
    <div class="ui fluid labeled input">
      <div class="ui  basic label"><span class="ui grey text">USD</span></div>
      <input name="price" type="number" min="0" bind:value={price} />
    </div>
    
  </div>
  <button id="submit-order" class="ui fluid green button" type="submit">Buy</button>
</form>
