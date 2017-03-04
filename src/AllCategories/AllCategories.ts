import { fetch } from 'domain-task';

import { SearchClient } from '../SearchClient';
import { BaseCall } from '../Common/BaseCall';
import { SearchType } from '../Common/SearchType';
import { Categories } from '../Data/Categories';
import { AuthToken } from '../Authentication/AuthToken';

import { AllCategoriesSettings } from './AllCategoriesSettings';

export class AllCategories extends BaseCall {
    private settings: AllCategoriesSettings;

    constructor(baseUrl: string, settings?: AllCategoriesSettings, auth?: AuthToken) {
        super(baseUrl, auth);
        this.settings = settings || new AllCategoriesSettings();
    }

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
