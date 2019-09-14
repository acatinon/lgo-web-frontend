import superAgent, { Response, SuperAgentRequest } from 'superagent';
import { OrderType, Side } from "../domain/order"
import { BaseUrl } from "../utils/constants";
import BigNumber from 'bignumber.js';

export function placeOrder(productId: string, type: OrderType, side: Side, quantity: BigNumber, price: BigNumber): SuperAgentRequest {
    return superAgent
        .post(BaseUrl + "/orders")
        .set('Content-Type', 'application/json')
        .send({
            type: type,
            side: side,
            product_id: productId,
            quantity: quantity.toString(),
            price: price.toString()
        });
}

export function cancelOrder(orderId: string) {
    superAgent
        .delete(BaseUrl + "/orders/" + orderId)
        .end();
}

export function getOrders(productId: string, page: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        superAgent
            .get(BaseUrl + "/orders")
            .query({ product_id: productId, page: page })
            .then(res => resolve(res));
    });
}

export function computeStatusDetails(status_reason: string) {
    switch (status_reason) {
      case "CanceledBySelfTradePrevention":
        return "Canceled by self trade prevention";
      case "CanceledByOwner":
        return "Canceled by owner";
      case "CanceledByAdministrator":
        return "Canceled by administrator";
      case "InvalidQuantity":
        return "Invalid quantity";
      case "InvalidPrice":
        return "Invalid price";
      case "InvalidAmount":
        return "Invalid amount";
      case "InvalidPriceIncrement":
        return "Invalid price increment";
      case "InvalidProduct":
        return "Invalid product";
      case "InsufficientFunds":
        return "Insufficient funds";
      default:
        return undefined;
    }
  }