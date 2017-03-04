import { fetch } from 'domain-task';

import { SearchClient } from '../SearchClient';
import { BaseCall } from '../Common/BaseCall';
import { SearchType } from '../Common/SearchType';
import { AuthToken } from '../Authentication/AuthToken';

import { BestBetsSettings } from './';

export class BestBets extends BaseCall {
    private settings: BestBetsSettings;

    constructor(baseUrl: string, settings?: BestBetsSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = settings || new BestBetsSettings();
    }

    public fetch(): Promise<string[]> {

        let url = this.baseUrl + this.settings.url;

        return fetch(url, this.requestObject())
            .then((response: Response) => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                }
                return response.json();
            })
            .then((bestBets: string[]) => {
                return bestBets;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
}
