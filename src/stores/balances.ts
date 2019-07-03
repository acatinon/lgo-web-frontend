import { readable } from 'svelte/store';
import { addListener } from "../services/common";

class Balance {
    available: number;
    escrowed: number;
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

                    balance.available = parseFloat(item[1]);
                    balance.escrowed = parseFloat(item[2]);
                }

                set(internal);
            }
        });

        return function stop() {}
    }
);