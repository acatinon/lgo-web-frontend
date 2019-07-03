
import { readable } from 'svelte/store';
import { addListener } from "../services/common";
import { Side } from "../domain/order";

interface Trade {
    trade_id: string;
    side: Side
    quantity: string;
    price: string;
    trade_creation_time: string
}

const internal: Trade[] = [];

export const trades = readable(internal,
    function start(set) {
        addListener(data => {
            if (data.channel === "trades") {
                if (data.type === "snapshot") {
                    internal.length = 0;
                }

                for (let trade of data.payload) {
                    internal.push(trade);
                }

                set(internal);
            }
        });

        return function stop() {}
    }
);