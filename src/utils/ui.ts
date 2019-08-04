import { Side } from "../domain/order";
import { get } from 'svelte/store';
export function color(side: Side) {
    return side === Side.Buy ? "green" : "red";
}

export function getBase(productId: string)  {  
    return productId ? productId.split("-")[0] : "";
}

export function getQuote(productId: string) {
    return productId ? productId.split("-")[1] : "";
}