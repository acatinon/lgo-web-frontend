<script>
  import {
    priceHistory,
    granularity,
    Granularity
  } from "../stores/price_history";
  import { createChart } from "lightweight-charts";
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
        granularity.set(value);
      }
    });
    
    const chart = createChart("chart-content", {
      width: $w - 60,
      height: $h,
      priceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.2
        }
      }
    });
    const candlestickSeries = chart.addCandlestickSeries();
    var volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: "volume"
      },
      overlay: true,
      scaleMargins: {
        top: 0.85,
        bottom: 0
      }
    });

    const candles = get(priceHistory);

    update(candles, candlestickSeries, volumeSeries);

    priceHistory.subscribe(candles => {
      update(candles, candlestickSeries, volumeSeries);
    });

    w.subscribe(newValue => {
      chart.applyOptions({ width: newValue - 60 });
    });

    h.subscribe(newValue => {
      chart.applyOptions({ height: newValue });
    });
  });

  function update(candles, candlestickSeries, volumeSeries) {
    const data = [];
    const volume = [];
    for (let candle of candles) {
      data.push({
        time: candle.date.unix(),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      });

      volume.push({
        time: candle.date.unix(),
        value: candle.volume
      });
    }

    candlestickSeries.setData(data);
    volumeSeries.setData(volume);
  }
</script>

<div id="chart-header" class="ui basic clearing vertical segment">
  <h5 class="ui dividing header">
    Chart
    <div id="granularity-selector" class="ui right floated compact selection dropdown">
      <div class="text" />
      <i class="dropdown icon" />
    </div>
  </h5>
</div>
<div id="chart-content" bind:clientWidth={$w} bind:clientHeight={$h} />
