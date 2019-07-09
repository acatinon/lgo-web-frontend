import { readable } from 'svelte/store';
import { addListener } from "../services/common";

class OrderBook {
    bids: { [key: number]: number } = {};
    asks: { [key: number]: number } = {};

    minAsk: number = Infinity;
    maxBid: number = 0;

    clear() {
        this.bids = {};
        this.asks = {};
    }
}

let internal = new OrderBook();

export const orderBook = readable(internal,
    function start(set) {

        addListener(data => {
            if (data.channel === "level2") {
                if (data.type === "snapshot") {
                    internal.clear();
                }

                for (let item of data.payload.bids) {
                    const price = update(internal.bids, item);
                    internal.maxBid = Math.max(price, internal.maxBid);
                }

                for (let item of data.payload.asks) {
                    const price = update(internal.asks, item);
                    internal.minAsk = Math.min(price, internal.minAsk);
                }

                set(internal);
            }
        });

        return function stop() { }
    }
);

function update(side: { [key: string]: number }, item: Array<string>): number {
    let price = parseFloat(item[0]);
    let amount = parseFloat(item[1]);
    if (amount === 0) {
        delete side[price];
    }
    else {
        side[price] = amount;
    }

    return price;
}