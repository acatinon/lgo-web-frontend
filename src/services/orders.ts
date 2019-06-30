
import { Type, Side } from "./common"

export interface OrderResponse {
    result: {
        orders: Order[]
    },
    nextPage: string
}

export interface Order {
    remaining_quantity: string;
    status: OrderStatus,
    id: string;
    batch_id: string;
    type: Type,
    side: Side,
    product_id: string;
    quantity: string;
    price: string;
    creation_date: string;
}

export enum OrderStatus {
    Open = "OPEN",
    Closed = "CLOSED"
}

