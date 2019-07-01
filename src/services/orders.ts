import superAgent from 'superagent';
import { OrderType, Side } from "../domain/order"
import { BaseUrl } from "../utils/constants";

export function placeOrder(productId: string, type: OrderType, side: Side, quantity: number, price: number) {
    superAgent
        .post(BaseUrl + "/orders")
        .set('Content-Type', 'application/json')
        .send({
            type: type,
            side: side,
            product_id: productId,
            quantity: quantity.toString(),
            price: price.toString()
        })
        .end();
}