<script>
  import { priceHistory } from "../stores/price_history";
  import { createChart } from "lightweight-charts";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  onMount(async () => {
    const chart = createChart("chart-content", {
      width: jQuery("#chart-content").width() - 60,
      height: 400,
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

<div id="chart-content" />
