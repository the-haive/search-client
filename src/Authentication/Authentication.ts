import { fetch } from 'domain-task';
import * as jwt from 'jsonwebtoken';

import { BaseCall } from '../Common/BaseCall';
import { SearchClient } from '../SearchClient';
import { AuthenticationSettings } from './AuthenticationSettings';
import { AuthToken } from './AuthToken';

export class Authentication extends BaseCall {

    private settings: AuthenticationSettings;

    /**
     * @param baseUrl 
     * @param settings Either a string that contains the initial authenticationToken, or a full AuthenticationSettings object.
     */
    constructor(baseUrl: string, settings?: AuthenticationSettings, auth?: AuthToken) {
        super(baseUrl, auth);

        this.settings = settings || new AuthenticationSettings();
        
        if (this.settings.token) {
            this.auth.authenticationToken = this.settings.token;
            this.settings.token = undefined;
            this.setupRefresh();
        } else if (this.settings.enabled) {
            // We authenticate immediately in order to have the token in place when the first calls come in.
            this.fetch();
        }
    }

    public fetch(): Promise<string> {

        let url = this.baseUrl + this.settings.url;

        return fetch(url, this.requestObject())
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

                // Finally we return the promise to the caller, should they want it.
                return data;
            })
            .catch((error) => {
                return Promise.reject(error);
            });
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
