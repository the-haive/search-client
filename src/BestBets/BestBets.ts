import { fetch } from 'domain-task';

import { SearchClient } from '../SearchClient';
import { BaseCall } from '../Common/BaseCall';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { AuthToken } from '../Authentication/AuthToken';

import { BestBetsSettings } from './';

/**
 * **Note: This service is experimental - and offer very limited functionality at the moment.** 
 * We may or may not extend this in the future.
 */
export class BestBets extends BaseCall<string[]> {

    /**
     * 
     * @param baseUrl - The base-url that the BestBets lookup is to use.
     * @param settings - The settings for how the BestBets instance is to behave.
     * @param auth - An object that controls the authentication for the lookups.
     */
    constructor(baseUrl: string, protected settings?: BestBetsSettings, auth?: AuthToken) {
        super(baseUrl, new BestBetsSettings(settings), auth);

        this.settings = new BestBetsSettings(settings);
    }

    /**
     * Fetches all best-bets from the backend.
     * @param query - For the BestBets service this parameter is ignored. 
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns an array of strings that represent the bests-bets.
     */
    public fetch(query: Query = new Query(), suppressCallbacks: boolean = false): Promise<string[]> {

        let url = `${this.baseUrl}/${this.settings.url}`;
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
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
        } else {
            return undefined;
        }
    }
}
