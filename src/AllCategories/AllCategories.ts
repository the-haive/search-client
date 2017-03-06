import { fetch } from 'domain-task';

import { SearchClient } from '../SearchClient';
import { BaseCall } from '../Common/BaseCall';
import { SearchType } from '../Common/SearchType';
import { Categories } from '../Data/Categories';
import { AuthToken } from '../Authentication/AuthToken';

import { AllCategoriesSettings } from './AllCategoriesSettings';

export class AllCategories extends BaseCall {

    /**
     * Creates an AllCategories instance that handles fetching all the categories from the server, if the server has this feature turned on.
     * @param baseUrl - The base-url that the AllCategories lookup is to use.
     * @param settings - The settings for how the AllCategories instance is to behave.
     * @param auth - An object that controls the authentication for the lookups.
     */
    constructor(baseUrl: string, private settings?: AllCategoriesSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = new AllCategoriesSettings(settings);
    }

    /**
     * Fetches all categories from the backend.
     * Note that the AllCategories feature depends on the search-service to have thie feature turned on in it's configuration.
     * @returns a promise that when resolved returns a Categories object.
     */
    public fetch(): Promise<Categories> {

        let url = this.baseUrl + this.settings.url;

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
    }
}
