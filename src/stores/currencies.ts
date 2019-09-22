import superAgent, { SuperAgentRequest } from 'superagent';
import { readable, derived } from 'svelte/store';
import { BaseUrl } from "../utils/constants";
import { currentBase as currentBaseProduct, currentQuote as currentQuoteProduct } from "./products";

export function getCurrencies(): SuperAgentRequest {
    return superAgent
        .get(BaseUrl + "/v1/live/currencies");
}

class Currency {
    code: string;
    name: string;
    scale: number;
}

const internal: { [key: string]: Currency} = {};

export const currencies = readable(internal,
    function start(set) {

        getCurrencies()
            .then(response => {
                debugger;
                for (let currency of response.body.currencies) {
                    internal[currency.code] = {
                        code: currency.code,
                        name: currency.name,
                        scale: currency.scale
                    };
                }

                set(internal);
            });

        return function stop() { }
    }
);

export const currentBase = derived(
    [currencies, currentBaseProduct],
    ([$currencies, $currentBaseProduct]) => $currencies[$currentBaseProduct]
);

export const currentQuote = derived(
    [currencies, currentQuoteProduct],
    ([$currencies, $currentQuoteProduct]) => $currencies[$currentQuoteProduct]
);
