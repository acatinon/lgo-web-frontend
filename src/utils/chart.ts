import { Candle, granularity } from "../stores/price_history";
import { createChart, ISeriesApi, IChartApi, BarData, HistogramData, UTCTimestamp, DeepPartial, ChartOptions, LayoutOptions } from "lightweight-charts";
import { addListener } from "../services/common";
import { get } from "svelte/store";
import moment from "moment";

let chart: IChartApi;
let candlestickSeries: ISeriesApi<"Candlestick">;
let volumeSeries: ISeriesApi<"Histogram">;
let lastCandle: BarData;
let lastVolume: HistogramData;

export function initChart(w: number, h: number, themeId: string) {
    
    chart = createChart("chart-container", {
        width: w,
        height: h,
        priceScale: {
            scaleMargins: {
                top: 0.2,
                bottom: 0.2
            }
        },
        layout:  getLayout(themeId)
    });

    /*
    addListener(data => {
        if (data.channel === "trades") {
            if (data.type === "update") {
                const candleDuration = get(granularity);
                const candleStart = moment((lastCandle.time as number) * 1000);
                const candleEnd = moment(candleStart).add(candleDuration, 'seconds');
                for (let trade of data.payload) {
                    const tradeTime = moment(trade.trade_creation_time);
                    const price = parseFloat(trade.price);
                    const quantity = parseFloat(trade.quantity);
                    if (tradeTime.isBetween(candleStart, candleEnd)) {
                        lastCandle.high = Math.max(lastCandle.high, price);
                        lastCandle.low = Math.min(lastCandle.low, price);
                        lastCandle.close = price;
                        lastVolume.value += quantity;
                    }
                    else {
                        console.log(candleStart.format() + " < " + tradeTime.format() + " < " + candleEnd.format());
                        lastCandle = {
                            time: candleEnd.unix() as UTCTimestamp,
                            open: price,
                            high: price,
                            low: price,
                            close: price
                        }
                        lastVolume = {
                            time: candleEnd.unix() as UTCTimestamp,
                            value: quantity
                        }
                    }
                }
                candlestickSeries.update(lastCandle);
                volumeSeries.update(lastVolume)
            }
        }
    });
    */
}

export function feedChart(candles: Candle[]) {
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

    const data: BarData[] = [];
    const volumes: HistogramData[] = [];

    for (let candle of candles) {
        data.push({
            time: candle.date.unix() as UTCTimestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close
        });

        volumes.push({
            time: candle.date.unix() as UTCTimestamp,
            value: candle.volume
        });
    }

    lastCandle = data[data.length - 1];
    lastVolume = volumes[volumes.length - 1];

    candlestickSeries.setData(data);
    volumeSeries.setData(volumes);
}

export function resetChart() {
    chart.removeSeries(candlestickSeries);
    chart.removeSeries(volumeSeries);
    candlestickSeries = null;
    volumeSeries = null;
}

export function applyOptions(options: DeepPartial<ChartOptions>) {
    chart.applyOptions(options);
}

export function getLayout(themeId: string): DeepPartial<LayoutOptions> {
    let bg = '#f9fafb';

    switch (themeId) {
        case "dark":
            bg = '#1b1c1d';
            break;
    }

    return {
        backgroundColor: bg
    }
}