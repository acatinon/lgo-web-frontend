<script>
  import Inputmask from "inputmask";
  import "jquery.inputmask";
  import "inputmask.numeric.extensions";
  import { placeOrder } from "../../services/orders";
  import { Side, OrderType } from "../../domain/order";
  import { onMount } from "svelte";
  import BigNumber from "bignumber.js";

  let side = Side.Buy;
  let type = OrderType.Limit;

  function selectBuy() {
    jQuery("#buy-tab").addClass("active");
    jQuery("#sell-tab").removeClass("active");
    jQuery("#submit-order")
      .addClass("positive")
      .removeClass("negative")
      .text("Buy");

    side = Side.Buy;
  }

  function selectSell() {
    jQuery("#sell-tab").addClass("active");
    jQuery("#buy-tab").removeClass("active");
    jQuery("#submit-order")
      .addClass("negative")
      .removeClass("positive")
      .text("Sell");

    side = Side.Sell;
  }

  function selectMarket() {
    jQuery("#market-button").addClass("active blue");
    jQuery("#limit-button").removeClass("active blue");
    jQuery("#quantity-field").hide();

    type = OrderType.Market;
  }

  function selectLimit() {
    jQuery("#limit-button").addClass("active blue");
    jQuery("#market-button").removeClass("active blue");
    jQuery("#quantity-field").show();

    type = OrderType.Limit;
  }

  function submitOrder() {
    let quantity = new BigNumber(
      jQuery("#quantity-field input").inputmask("unmaskedvalue")
    );
    let price = new BigNumber(
      jQuery("#price-field input").inputmask("unmaskedvalue")
    );
    placeOrder("BTC-USD", type, side, quantity, price);
  }

  onMount(async () => {
    jQuery("#place-order input").inputmask("numeric", {
      groupSeparator: ",",
      allowMinus: false
    });
  });
</script>

<div id="place-order" class="ui fluid card">
  <div class="ui secondary menu">
    <h5 class="ui header item">Place an order</h5>
    <div class="right filled item">
      <div class="ui pointing secondary menu">
        <span id="buy-tab" class="right active item" on:click={selectBuy}>
          Buy
        </span>
        <span id="sell-tab" class="item" on:click={selectSell}>Sell</span>
      </div>
    </div>
  </div>
  <form
    class="ui basic segment form content"
    autocomplete="off"
    on:submit|preventDefault={submitOrder}>

    <div class="field">
      <div class="ui fluid buttons">
        <button
          id="market-button"
          class="ui button"
          on:click|preventDefault={selectMarket}>
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
        <div class="ui basic label">
          <span class="ui grey text">BTC</span>
        </div>
        <input name="quantity" />
      </div>
    </div>

    <div id="price-field" class="field">
      <label>Price</label>
      <div class="ui fluid labeled input">
        <div class="ui basic label">
          <span class="ui grey text">USD</span>
        </div>
        <input name="price" />
      </div>

    </div>
    <button id="submit-order" class="ui fluid positive button" type="submit">
      Buy
    </button>
  </form>
</div>
