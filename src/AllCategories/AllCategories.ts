import { fetch } from 'domain-task';

import { SearchClient } from '../SearchClient';
import { BaseCall } from '../Common/BaseCall';
import { SearchType } from '../Common/SearchType';
import { Query } from '../Common/Query';
import { Categories } from '../Data/Categories';
import { AuthToken } from '../Authentication/AuthToken';

import { AllCategoriesSettings } from './AllCategoriesSettings';

export class AllCategories extends BaseCall<Categories> {

    /**
     * Creates an AllCategories instance that handles fetching all the categories from the server, if the server has this feature turned on.
     * @param baseUrl - The base-url that the AllCategories lookup is to use.
     * @param settings - The settings for how the AllCategories instance is to behave.
     * @param auth - An object that controls the authentication for the lookups.
     */
    constructor(baseUrl: string, protected settings: AllCategoriesSettings = new AllCategoriesSettings(), auth?: AuthToken) {
        super(baseUrl, new AllCategoriesSettings(settings), auth);
    }

    /**
     * Fetches all categories from the backend.
     * Note that the AllCategories feature depends on the search-service to have this feature turned on in it's configuration.
     * @param query - For the AllCategories service this parameter is ignored. 
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(query: Query, suppressCallbacks: boolean = false): Promise<Categories> {

        let url = this.baseUrl + this.settings.url;
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            return fetch(url, this.requestObject())
                .then((response: Response) => {
                    if (!response.ok) {
                        throw Error(`${response.status} ${response.statusText} for request url '${url}'`);
                    }
                    return response.json();
                })
                .then((categories: Categories) => {
                    return categories;
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        } else {
            return undefined;
        }
    }
}
