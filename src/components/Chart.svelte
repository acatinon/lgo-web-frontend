<script>
  import {
    priceHistory,
    granularity,
    Granularity
  } from "../stores/price_history";
  import { theme } from "../stores/settings";
  import {
    initChart,
    feedChart,
    resetChart,
    applyOptions,
    getOptions
  } from "../utils/chart";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";

  let w = writable();
  let h = writable();

  onMount(async () => {
    jQuery("#granularity-selector").dropdown({
      values: [
        {
          name: "1m",
          value: Granularity.OneMinute
        },
        {
          name: "5m",
          value: Granularity.FiveMinutes
        },
        {
          name: "15m",
          value: Granularity.FifteenMinutes
        },
        {
          name: "1h",
          value: Granularity.OneHour,
          selected: true
        },
        {
          name: "6h",
          value: Granularity.SixHours
        },
        {
          name: "1d",
          value: Granularity.OneDay
        }
      ],
      onChange: function(value, text, $selectedItem) {
        granularity.set(parseInt(value, 10));
      }
    });

    initChart($w, $h, $theme);

    const candles = get(priceHistory);

    feedChart(candles);

    priceHistory.subscribe(candles => {
      resetChart();
      feedChart(candles);
    });

    w.subscribe(newValue => {
      applyOptions({ width: newValue - 15 });
    });

    h.subscribe(newValue => {
      applyOptions({ height: newValue });
    });

    theme.subscribe(value => {
      if (value) {
        applyOptions(
          getOptions(value)
        );
      }
    });
  });
</script>

<div id="chart" class="block">
  <div class="ui secondary menu">
    <h5 class="ui header item">Chart</h5>
    <div
      id="granularity-selector"
      class="ui compact selection dropdown right item">
      <div class="text">Test</div>
      <i class="dropdown icon" />
    </div>
  </div>
  <div class="ui divider" />
  <div
    id="chart-container"
    class="content"
    bind:clientWidth={$w}
    bind:clientHeight={$h} />
</div>
