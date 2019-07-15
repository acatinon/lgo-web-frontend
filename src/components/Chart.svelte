<script>
  import { priceHistory } from "../stores/price_history";
  import { createChart } from "lightweight-charts";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";

  let w = writable();
  let h = writable();

  onMount(async () => {
    const chart = createChart("chart-content", {
      width: $w - 60,
      height: $h - 60,
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
      chart.applyOptions({ height: newValue - 60 });
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

<div id="chart-content" bind:clientWidth={$w} bind:clientHeight={$h} />
