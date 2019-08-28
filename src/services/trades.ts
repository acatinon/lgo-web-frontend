import superAgent, { SuperAgentRequest, Response } from 'superagent';
import { BaseUrl } from "../utils/constants";

export function getTrades(productId: string, page: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        superAgent
            .get(BaseUrl + "/trades")
            .query({ product_id: productId, page: page, max_results: 20 })
            .then(res => resolve(res));
    });
}
