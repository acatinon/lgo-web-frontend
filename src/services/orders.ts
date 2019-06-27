import superAgent, { SuperAgentRequest } from 'superagent';
import { BaseUrl } from "../utils/constants";
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

export function getOrders(productId: string): SuperAgentRequest {
    return superAgent
    .get(BaseUrl + "/orders")
    .query({ product_id: productId });
}