import { Candle } from "../stores/price_history";
import { createChart, ISeriesApi, IChartApi, BarData, HistogramData, UTCTimestamp, DeepPartial, ChartOptions } from "lightweight-charts";

let chart: IChartApi;
let candlestickSeries: ISeriesApi<"Candlestick">;
let volumeSeries: ISeriesApi<"Histogram">;

export function initChart(w: number, h: number) {
    chart = createChart("chart-content", {
        width: w - 60,
        height: h,
        priceScale: {
            scaleMargins: {
                top: 0.2,
                bottom: 0.2
            }
        }
    });

    candlestickSeries = chart.addCandlestickSeries();
    volumeSeries = chart.addHistogramSeries({
        priceFormat: {
            type: "volume"
        },
        overlay: true,
        scaleMargins: {
            top: 0.85,
            bottom: 0
        }
    });
}

export function updateChart(candles: Candle[]) {
    const data: BarData[] = [];
    const volume: HistogramData[] = [];

    for (let candle of candles) {
        data.push({
            time: candle.date.unix() as UTCTimestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close
        });

        volume.push({
            time: candle.date.unix() as UTCTimestamp,
            value: candle.volume
        });
    }

    candlestickSeries.setData(data);
    volumeSeries.setData(volume);
}

export function applyOptions(options: DeepPartial<ChartOptions>) {
    chart.applyOptions(options);
}