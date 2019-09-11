<script>
  import "fomantic-ui-less/semantic.less";
  import "./css/wallets.less";
  import "./js/semantic.js";
  import "./js/jquery.overlay-scrollbars.js";
  import { onMount, afterUpdate } from "svelte";
  import { derived } from "svelte/store";
  import { setTheme, Page } from "./utils/ui";
  import { theme } from "./stores/settings";
  import Menu from "./components/Menu.svelte";
  import { Operation } from "./domain/operation";
  import { balances } from "./stores/balances";
  import { getOperations } from "./services/operations";
  import {
    open,
    isOpened,
    isOpening,
    send,
    addListener
  } from "./services/common";
  import BigNumber from "bignumber.js";
  import moment from "moment";
  import Date from "./components/Date.svelte";
  import FocusedNumber from "./components/FocusedNumber.svelte";
  import Settings from "./components/Settings.svelte";

  const currencies = derived(balances, $balances => Object.keys($balances));
  let operations = [];
  let operationsNextPage;

  afterUpdate(() => {
    jQuery("#wallets .menu .item").click(async event => {
      const target = jQuery(event.target);
      const currency = target.attr("data-tab");
      await queryOperations(currency);

      if (operationsNextPage === "") {
        jQuery("#loader").hide();
      }

      jQuery("#operations").show();
      jQuery("#wallets .menu .item").removeClass("active");
      target.addClass("active");
    });
  });

  onMount(async () => {
    setTheme($theme);

    theme.subscribe(value => {
      if (value) {
        setTheme(value, Page.Wallets);
      }
    });

    jQuery("#operations").hide();

    open().then(() => subscribe());
  });

  async function queryOperations(currency) {
    const response = await getOperations(currency);
    operations.length = 0;

    for (let o of response.body.result.operations) {
      const newOperation = {
        id: o.id,
        created_at: moment(o.created_at),
        type: o.type,
        quantity: new BigNumber(o.quantity),
        status: o.status
      };

      operations = [...operations, newOperation];
    }

    operationsNextPage = response.body.next_page;
  }

  function subscribe() {
    send({
      type: "subscribe",
      channels: [
        {
          name: "balance"
        }
      ]
    });
  }
</script>

<div id="site">
  <Menu activePage="wallets">
    <span class="item">Wallets</span>
  </Menu>
  <div class="ui container">
    <div class="ui fluid card">
      <div class="title content">
        <h3 class="header">Wallets</h3>
      </div>
      <div id="wallets" class="content">
        <div class="ui grid">
          <div class="four wide column">
            <div class="ui vertical secondary fluid menu">
              {#each $currencies as c}
                <a class="item" data-tab={c}>{c}</a>
              {/each}
            </div>
          </div>
          <div class="twelve wide stretched column">
            <div id="operations">
              <table class="ui compact very basic four column fixed table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th class="right aligned">Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
              </table>
              <div class="scrollable content">
                <table class="ui compact very basic four column fixed table">
                  <tbody>
                    {#each operations as operation (operation.id)}
                      <tr>
                        <td>
                          <Date value={operation.created_at} format="ll LT" />
                        </td>
                        <td>{operation.type}</td>
                        <td class="right aligned">
                          <FocusedNumber value={operation.quantity} />
                        </td>
                        <td>{operation.status}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
                <div id="loader" class="ui very padded segment">
                  <div class="ui active centered inline loader" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<Settings />