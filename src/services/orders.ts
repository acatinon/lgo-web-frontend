import request, { RequestPromise } from 'request-promise-native';
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

export function getOrders(productId: string): RequestPromise<OrderResponse> {
    const options = {
        uri: BaseUrl + "/orders",
        qs: {
            product_id: productId
        },
        headers: {},
        json: true 
    };

    return request(options);
}