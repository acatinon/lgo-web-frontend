import { readable } from 'svelte/store';
import { addListener } from "../services/common";
import BigNumber from "bignumber.js"

class OrderBook {
    bids = new Map<BigNumber, BigNumber>();
    asks = new Map<BigNumber, BigNumber>();

    clear() {
        this.bids = new Map<BigNumber, BigNumber>();
        this.asks = new Map<BigNumber, BigNumber>();
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
                }

                for (let item of data.payload.asks) {
                    const price = update(internal.asks, item);
                }

                set(internal);
            }
        });

        return function stop() { }
    }
);

function update(side: Map<BigNumber, BigNumber>, item: Array<string>): BigNumber {
    let price = null;
    let amount = new BigNumber(item[1]);
    let it = side.keys();
    let result = it.next();

    while (!result.done && price === null) {
        if (result.value.isEqualTo(item[0])) {
            price = result.value;
            break;
        }
        result = it.next();
    }

    if (price === null) {
        price = new BigNumber(item[0]);
    }
    
    if (amount.isZero()) {
        side.delete(price);
        return undefined;
    }
    else {
        side.set(price, amount);
        return price;
    }


}