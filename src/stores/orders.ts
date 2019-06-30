import superAgent, { SuperAgentRequest } from 'superagent';
import { readable } from 'svelte/store';
import { ws, Type, Side } from "../services/common"
import { BaseUrl } from "../utils/constants";

export interface Order {
    id: string;
    type: Type;
    side: Side;
    quantity: string;
    remaining_quantity: string;
    price: string;
    creation_date: string;
    status: OrderStatus;
}

export enum OrderStatus {
    Open = "OPEN",
    Closed = "CLOSED",
    Pending = "PENDING"
}

class Orders {

    openOrders: { [key: string]: Order } = {};
    closedOredes: { [key: string]: Order } = {};

    clear() {
        this.openOrders = {};
    }

    update(order: any) {
        switch (order.type) {
            case "pending":
                let newPendingOrder: Order = {
                    id: order.order_id,
                    type: order.order_type,
                    side: order.side,
                    quantity: order.quantity,
                    price: order.price,
                    remaining_quantity: order.quantity,
                    status: OrderStatus.Pending,
                    creation_date: order.time
                }

                this.openOrders[order.order_id] = newPendingOrder;
                break;
            case "invalid":
                break;
            case "open":
                let openOrder = this.openOrders[order.order_id];
                openOrder.status = OrderStatus.Open;
                break;
            case "match":
                let matchingOrder = this.openOrders[order.order_id];
                matchingOrder.remaining_quantity = order.remaining_quantity;
                break;
            case "done":
                break;
            default: // Open orders from snapshot
                const newOpenOrder: Order = {
                    id: order.order_id,
                    type: order.order_type,
                    side: order.side,
                    quantity: order.quantity,
                    price: order.price,
                    remaining_quantity: order.remaining_quantity,
                    status: OrderStatus.Open,
                    creation_date: order.creation_date || order.order_creation_time
                };

                this.openOrders[order.id || order.order_id] = newOpenOrder;
        }
    }
}

function getOrders(productId: string): SuperAgentRequest {
    return superAgent
        .get(BaseUrl + "/orders")
        .query({ product_id: productId });
}

const internal = new Orders();

export const orders = readable(internal,
    function start(set) {

        // TODO: Handle product id and pages
        getOrders("BTC-USD")
            .then(response => {
                for (let order of response.body.result.orders) {
                    internal.update(order);
                }

                set(internal);

                ws.onUnpackedMessage.addListener(data => {
                    if (data.channel === "user") {
                        if (data.type === "snapshot") {
                            internal.clear();
                        }

                        for (let order of data.payload) {
                            internal.update(order);
                        }

                        set(internal);
                    }
                });
            });

        return function stop() {

        }
    }
);