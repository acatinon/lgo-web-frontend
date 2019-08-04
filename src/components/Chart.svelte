<script>
  import {
    priceHistory,
    granularity,
    Granularity
  } from "../stores/price_history";
  import {
    initChart,
    feedChart,
    resetChart,
    applyOptions
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

    initChart($w, $h);

    const candles = get(priceHistory);

    feedChart(candles);

    priceHistory.subscribe(candles => {
      resetChart();
      feedChart(candles);
    });

    w.subscribe(newValue => {
      applyOptions({ width: newValue - 60 });
    });

    h.subscribe(newValue => {
      applyOptions({ height: newValue });
    });
  });
</script>

<div id="chart" class="block">
  <div id="chart-header" class="ui basic clearing vertical segment">
    <h5 class="ui dividing header">
      Chart
      <div
        id="granularity-selector"
        class="ui right floated compact selection dropdown">
        <div class="text" />
        <i class="dropdown icon" />
      </div>
    </h5>
  </div>
  <div id="chart-content" class="content" bind:clientWidth={$w} bind:clientHeight={$h} />
</div>
