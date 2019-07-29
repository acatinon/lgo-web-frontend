import superAgent, { SuperAgentRequest } from 'superagent';
import { readable } from 'svelte/store';
import { addListener } from "../services/common";
import { OrderType, OrderStatus, Side } from "../domain/order";
import { BaseUrl } from "../utils/constants";

interface Order {
    id: string;
    type: OrderType;
    side: Side;
    quantity: string;
    remaining_quantity: string;
    price: string;
    creation_date: string;
    status: OrderStatus;
}

class Orders {

    openOrders: Order[] = [];
    filledOrders: Order[] = [];

    clear() {
        this.openOrders = [];
        this.filledOrders = [];
    }

    find(array: Order[], id: string) {
        return array.findIndex(o => o.id === id);
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

                this.openOrders.push(newPendingOrder);
                break;
            case "invalid":
                break;
            case "open":
                {
                    const index = this.find(this.openOrders, order.order_id);
                    let openOrder = this.openOrders[index];
                    openOrder.status = OrderStatus.Open;
                }
                break;
            case "match":
                {
                    const index = this.find(this.openOrders, order.order_id);
                    let matchingOrder = this.openOrders[index];
                    matchingOrder.remaining_quantity = order.remaining_quantity;
                }
                break;
            case "done":
                {
                    switch (order.reason) {
                        case 'canceled':
                        case 'canceledbyadministrator':
                        case 'filled':
                            const index = this.find(this.openOrders, order.order_id);
                            let ordertoUpdate = this.openOrders[index];
                            ordertoUpdate.status = order.reason;
                            this.filledOrders.unshift(ordertoUpdate);
                            this.openOrders.splice(index, 1);
                    }
                }
                break;
            default: // Open orders from snapshot
                const newOpenOrder: Order = {
                    id: order.id || order.order_id,
                    type: OrderType.Limit,
                    side: order.side,
                    quantity: order.quantity,
                    price: order.price,
                    remaining_quantity: order.remaining_quantity,
                    status: OrderStatus.Open,
                    creation_date: order.creation_date || order.order_creation_time
                };

                this.openOrders.push(newOpenOrder);
        }
    }

    addClosed(order: any) {
        this.filledOrders.push({
            id: order.id,
            type: order.order_type,
            side: order.side,
            quantity: order.quantity,
            price: order.price,
            remaining_quantity: order.remaining_quantity,
            status: order.status_reason.toLowerCase(),
            creation_date: order.creation_date
        });
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
        addListener(data => {
            if (data.channel === "user") {

                for (let order of data.payload) {
                    internal.update(order);
                }

                set(internal);
            }
        });

        // TODO: Handle product id and pages
        getOrders("BTC-USD")
            .then(response => {
                for (let order of response.body.result.orders) {
                    if (order.status === "DONE" && order.status_reason === "Filled") {
                        internal.addClosed(order);
                    }
                }

                set(internal);
            });

        return function stop() { }
    }
);