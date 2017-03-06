import { fetch } from 'domain-task';

import { SearchClient } from '../SearchClient';
import { BaseCall } from '../Common/BaseCall';
import { SearchType } from '../Common/SearchType';
import { AuthToken } from '../Authentication/AuthToken';

import { BestBetsSettings } from './';

export class BestBets extends BaseCall {

    /**
     * 
     * @param baseUrl - The base-url that the BestBets lookup is to use.
     * @param settings - The settings for how the BestBets instance is to behave.
     * @param auth - An object that controls the authentication for the lookups.
     */
    constructor(baseUrl: string, private settings?: BestBetsSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = BestBetsSettings.new(settings);
    }

    /**
     * Fetches all best-bets from the backend.
     * @returns a promise that when resolved returns an array of strings that represent the bests-bets.
     */
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
