import superAgent, { SuperAgentRequest } from 'superagent';
import { writable, derived } from 'svelte/store';
import { BaseUrl } from "../utils/constants";
import moment from "moment";

export interface Candle {
    date: moment.Moment
    low: number
    high: number,
    open: number,
    close: number,
    volume: number
}

export enum Granularity {
    OneMinute = 60,
    FiveMinutes = 300,
    FifteenMinutes = 900,
    OneHour = 3600,
    SixHours = 21600,
    OneDay = 86400
}


function getPriceHistory(productId: string, start: moment.Moment, end: moment.Moment, granularity: Granularity): SuperAgentRequest {
    return superAgent
        .get(BaseUrl + "/products/" + productId + "/candles")
        .query({ start: start.toISOString(), end: end.toISOString(), granularity: granularity });
}

const internal: Candle[] = [];

export const granularity = writable(Granularity.OneHour);

export const priceHistory = derived(granularity,
    ($granularity, set) => {
        const now = moment();
        const begin = moment().subtract($granularity * 400, 'seconds');

        getPriceHistory("BTC-USD", begin, now, $granularity)
            .then(response => {
                internal.length = 0;
                for (let price of response.body.prices) {
                    let candle: Candle = {
                        date: moment(price[0]),
                        low: parseFloat(price[1]),
                        high: parseFloat(price[2]),
                        open: parseFloat(price[3]),
                        close: parseFloat(price[4]),
                        volume: parseFloat(price[5])
                    }

                    internal.push(candle);
                }

                set(internal);
            });
    },
    internal
);