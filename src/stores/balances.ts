import { readable } from 'svelte/store';
import { addListener } from "../services/common";
import BigNumber from "bignumber.js"

class Balance {
    available: BigNumber;
    escrowed: BigNumber;
}

let internal: { [key: string]: Balance } = {};

export const balances = readable(internal,
    function start(set) {

        addListener(data => {
            if (data.channel === "balance") {
                if (data.type === "snapshot") {
                    internal = {};
                }

                for (let item of data.payload) {
                    let currency = item[0];
                    let balance;
                    if (internal[currency] === undefined) {
                        balance = new Balance();
                        internal[currency] = balance;
                    }
                    else {
                        balance = internal[currency];
                    }

                    balance.available = new BigNumber(item[1]);
                    balance.escrowed = new BigNumber(item[2]);
                }

                set(internal);
            }
        });

        return function stop() {}
    }
);