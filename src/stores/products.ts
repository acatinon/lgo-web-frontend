import superAgent, { SuperAgentRequest } from 'superagent';
import { readable, writable, get } from 'svelte/store';
import { BaseUrl } from "../utils/constants";

export function getProducts(): SuperAgentRequest {
    return superAgent
        .get(BaseUrl + "/products");
}

class Product {
    id: string;
    total: {
        limits: Limits;
    };
    base: {
        id: string;
        limits: Limits;
    };
    quote: {
        id: string;
        increment: number;
        limits: Limits;
    };
}

class Limits {
    min: number;
    max: number;
}

const internal: Product[] = [];

export const products = readable(internal,
    function start(set) {

        getProducts()
            .then(response => {
                for (let product of response.body.products) {
                    internal.push(product);
                }

                set(internal);
            });

        return function stop() { }
    }
);

function createCurrentProduct() {
    const { subscribe, update } = writable(undefined);
    let previousValue: Product;

    return {
        subscribe,
        set: (value: Product) => {
            update(oldValue => {
                previousValue = oldValue;
                return value;
            });
        },
        getPreviousValue: () => previousValue
    }
}
export const currentProduct = createCurrentProduct();