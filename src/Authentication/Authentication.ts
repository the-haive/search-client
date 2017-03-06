import { fetch } from 'domain-task';
import * as jwt from 'jsonwebtoken';

import { BaseCall } from '../Common/BaseCall';
import { SearchClient } from '../SearchClient';
import { AuthenticationSettings } from './AuthenticationSettings';
import { AuthToken } from './AuthToken';

export class Authentication extends BaseCall {

    /**
     * Creates an Authentication object that knows where to get the auth-token and when to refresh it.
     * @param baseUrl - The baseUrl that the authentication is to operate from.
     * @param settings - The settings for the authentication object.
     */
    constructor(baseUrl: string, private settings?: AuthenticationSettings, auth?: AuthToken) {
        super(baseUrl, auth);

        this.settings = new AuthenticationSettings(settings);
        
        if (this.settings.token) {
            this.auth.authenticationToken = this.settings.token;
            this.settings.token = undefined;
            this.setupRefresh();
        } else if (this.settings.enabled) {
            // We authenticate immediately in order to have the token in place when the first calls come in.
            this.fetch();
        }
    }

    /**
     * Fetches the authentication-token from the server.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a jwt token.
     */
    public fetch(suppressCallbacks: boolean = false): Promise<string> {

        let url = this.baseUrl + this.settings.url;
        let reqInit = this.requestObject();

        this.cbBusy(suppressCallbacks, true, url, reqInit);

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
    }

    private cbBusy(suppressCallbacks: boolean, loading: boolean, url: string, reqInit: RequestInit): void {
        if (this.settings.cbBusy && !suppressCallbacks) {
            this.settings.cbBusy(true, url, reqInit);
        }
    }

    private cbError(suppressCallbacks: boolean, error: any, url: string, reqInit: RequestInit): void {
        this.cbBusy(suppressCallbacks, false, url, reqInit);
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbError(error);
        }
    }

    private cbSuccess(suppressCallbacks: boolean, authToken: string, url: string, reqInit: RequestInit): void {
        this.cbBusy(suppressCallbacks, false, url, reqInit);
        if (this.settings.cbSuccess && !suppressCallbacks) {
            this.settings.cbSuccess(authToken);
        }
    }

    private setupRefresh() {
        try {
            let token = jwt.decode(this.auth.authenticationToken);
            let expiration = token.exp ? new Date(token.exp * 1000) : undefined;

            // For now we fae that the tokjen expires in 15 mins
            if (expiration) {
                let remainingSeconds = expiration.getSeconds() - new Date().getSeconds();
                remainingSeconds -= this.settings.trigger.expiryOverlap;

                console.debug(`Setting up auth-refresh in ${remainingSeconds} seconds, at ${expiration}.`, token);
                setTimeout(() => {
                    this.fetch();
                }, remainingSeconds * 1000);
            } else {
                console.debug("The received auth JWT token does not expire.", token);
            }
        } catch (e) {
            console.error(`Unable to parse the provided token '${this.auth.authenticationToken}'`);
        }
    }
}
