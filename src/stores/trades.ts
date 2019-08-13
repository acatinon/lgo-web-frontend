
import { readable } from 'svelte/store';
import { addListener } from "../services/common";
import { Side } from "../domain/order";
import BigNumber from "bignumber.js"
import moment from "moment";

interface Trade {
    id: string;
    side: Side
    quantity: BigNumber;
    price: BigNumber;
    creation_date: moment.Moment
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
                    internal.unshift({
                        id: trade.trade_id,
                        side: trade.side,
                        quantity: new BigNumber(trade.quantity),
                        price: new BigNumber(trade.price),
                        creation_date: moment(trade.trade_creation_time)
                    });
                }

                if (internal.length > 200)
                    internal.length = 200;

                set(internal);
            }
        });

        return function stop() { }
    }
);