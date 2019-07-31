import { Side } from "../domain/order";

export function color(side: Side) {
    return side === Side.Buy ? "green" : "red";
}