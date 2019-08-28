import superAgent, { SuperAgentRequest, Response } from 'superagent';
import { BaseUrl } from "../utils/constants";
import { Trade } from "../domain/trade"
import BigNumber from "bignumber.js"
import moment from "moment";


export async function getTrades(productId: string): Promise<Trade[]> {
    const response = await queryTrades(productId);
    const trades = new Array<Trade>();

    for (let t of response.body.result.trades) {
        trades.push({
            id: t.id,
            product_id: t.product_id,
            quantity: new BigNumber(t.quantity),
            price: new BigNumber(t.price),
            fees: new BigNumber(t.fees),
            creation_date: moment(t.creation_date),
            side: t.side,
            order_id: t.order_id,
            liquidity: t.liquidity
        })
    }

    return trades;
}

function queryTrades(productId: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        superAgent
            .get(BaseUrl + "/trades")
            .query({ product_id: productId })
            .then(res => resolve(res));
    });



}
