import { readable } from 'svelte/store';
import { addListener } from "../services/common";
import { OrderType, OrderStatus, Side } from "../domain/order";
import BigNumber from "bignumber.js"
import moment from "moment";


interface Order {
    id: string;
    type: OrderType;
    side: Side;
    quantity: BigNumber;
    remaining_quantity: BigNumber;
    price: BigNumber;
    creation_date: moment.Moment;
    status: OrderStatus;
}

function update(order: any) {
    switch (order.type) {
        case "pending":
            let newPendingOrder: Order = {
                id: order.order_id,
                type: order.order_type,
                side: order.side,
                quantity: new BigNumber(order.quantity),
                price: new BigNumber(order.price),
                remaining_quantity: new BigNumber(order.quantity),
                status: OrderStatus.Pending,
                creation_date: moment(order.time)
            }

            internal.push(newPendingOrder);
            break;
        case "invalid":
            const index = internal.findIndex(o => o.id === order.order_id);
            internal.splice(index, 1);
            break;
        case "open":
            {
                const openOrder = internal.find(o => o.id === order.order_id);
                openOrder.status = OrderStatus.Open;
            }
            break;
        case "match":
            {
                const matchingOrder = internal.find(o => o.id === order.order_id);
                matchingOrder.remaining_quantity = new BigNumber(order.remaining_quantity);
            }
            break;
        case "done":
            {
                switch (order.reason) {
                    case 'canceled':
                    case 'canceledbyadministrator':
                    case 'filled':
                        const index = internal.findIndex(o => o.id === order.order_id);
                        internal.splice(index, 1);
                }
            }
            break;
        default: // Open orders from snapshot
            const newOpenOrder: Order = {
                id: order.id || order.order_id,
                type: OrderType.Limit,
                side: order.side,
                quantity: new BigNumber(order.quantity),
                price: new BigNumber(order.price),
                remaining_quantity: new BigNumber(order.remaining_quantity),
                status: OrderStatus.Open,
                creation_date: moment(order.creation_date || order.order_creation_time)
            };

            internal.push(newOpenOrder);
    }
}

const internal: Order[] = [];

export const orders = readable(internal,
    function start(set) {
        addListener(data => {
            if (data.channel === "user") {

                for (let order of data.payload) {
                    update(order);
                }

                set(internal);
            }
        });

        /*
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
*/
        return function stop() { }
    }
);