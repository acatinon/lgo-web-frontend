import { readable } from 'svelte/store';
import { addListener } from "../services/common";

class OrderBook {
    bids: { [key: string]: number } = {};
    asks: { [key: string]: number } = {};

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
                    update(internal.bids, item);
                }

                for (let item of data.payload.asks) {
                    update(internal.asks, item);
                }

                set(internal);
            }
        });

        return function stop() { }
    }
);

function update(side: { [key: string]: number }, item: Array<string>) {
    let amount = parseFloat(item[1]);
    if (amount === 0) {
        delete side[item[0]];
    }
    else {
        side[item[0]] = amount;
    }
}