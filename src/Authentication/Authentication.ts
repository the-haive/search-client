import { fetch } from 'domain-task';
import * as jwt from 'jwt-simple';

import { BaseCall } from '../Common/BaseCall';
import { Query } from '../Common/Query';

import { AuthenticationSettings } from './AuthenticationSettings';
import { AuthToken } from './AuthToken';

export class Authentication extends BaseCall<any> {

    /**
     * Creates an Authentication object that knows where to get the auth-token and when to refresh it.
     * @param baseUrl - The baseUrl that the authentication is to operate from.
     * @param settings - The settings for the authentication object.
     * @param auth - An object that controls the authentication for the lookups.
     */
    constructor(baseUrl: string, protected settings: AuthenticationSettings = new AuthenticationSettings(), auth?: AuthToken) {
        super(baseUrl, settings, auth);
        if (this.settings && this.settings.token) {
            this.auth.authenticationToken = this.settings.token;
            this.settings.token = undefined;
            this.setupRefresh();
        } else if (this.settings.enabled) {
            // We authenticate immediately in order to have the token in place when the first calls come in.
            this.update(null);
        }
    }

    /**
     * Fetches the authentication-token from the server.
     * @param query - For the Autentication service this parameter is ignored. 
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a jwt token.
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<string> {
        let url = this.baseUrl + this.settings.url;
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            return fetch(url, reqInit)
                .then((response: Response) => {
                    if (!response.ok) {
                        throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                    }
                    return response.json();
                })
                .then((data: any) => {
                    // Find the auth token by using the settings for where it is in the structure.
                    for (let i of this.settings.tokenPath) {
                        data = data[i];
                    }

                    // Update the token
                    this.auth.authenticationToken = data;

                    // Set up a timer for refreshing the token before/if it expires.
                    this.setupRefresh();

                    this.cbSuccess(suppressCallbacks, this.auth.authenticationToken, url, reqInit);
                    return this.auth.authenticationToken;
                })
                .catch((error) => {
                    this.cbError(suppressCallbacks, error, url, reqInit);
                    return Promise.reject(error);
                });
        } else {
            return undefined;
        }
    }

    private setupRefresh() {
        try {
            if (this.auth && this.auth.authenticationToken) {
                let token = jwt.decode(this.auth.authenticationToken, null, true);
                let expiration = token.exp ? new Date(token.exp * 1000) : undefined;
                if (expiration) {
                    let remainingSeconds = (expiration.valueOf() - new Date().valueOf()) / 1000;
                    remainingSeconds = Math.max(remainingSeconds - this.settings.trigger.expiryOverlap, 0);

                    //console.log(`Setting up auth-refresh in ${remainingSeconds} seconds, at ${expiration}.`, token);
                    setTimeout(() => {
                        this.update(null);
                    }, remainingSeconds);
                } else {
                    //console.log("The received auth JWT token does not expire.", token);
                }
            }
        } catch (e) {
            console.error(`Unable to parse the provided token '${this.auth.authenticationToken}': ${e}`);
        }
    }
}
