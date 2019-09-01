import superAgent, { Response } from 'superagent';
import { BaseUrl } from "../utils/constants";

export function getTrades(productId: string, page: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        superAgent
            .get(BaseUrl + "/trades")
            .query({ product_id: productId, page: page })
            .then(res => resolve(res));
    });
}
