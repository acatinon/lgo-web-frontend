import superAgent, { Response } from 'superagent';
import { BaseUrl } from "../utils/constants";
import BigNumber from 'bignumber.js';

export function getOperations(currencyCode: string, page: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        superAgent
            .get(BaseUrl + "/operations")
            .query({ currency_code: currencyCode, page: page })
            .then(res => resolve(res));
    });
}