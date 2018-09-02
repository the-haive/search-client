import { AuthToken } from "../Authentication";
import {
    Fetch,
    BaseCall,
    DateSpecification,
    Filter,
    OrderBy,
    Query,
    SearchType
} from "../Common";
import { FindQueryConverter } from "./FindQueryConverter";
import { FindSettings } from "./FindSettings";
import { Matches } from "../Data";

/**
 * The Find service queries the search-engine for search-matches for the given query.
 *
 * It is normally used indirectly via the SearchClient class.
 */
export class Find extends BaseCall<Matches> {
    private queryConverter: FindQueryConverter;

    /**
     * Creates a Find instance that handles fetching matches dependent on settings and query.
     * @param baseUrl - The base url that the find call is to use.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(
        baseUrl: string,
        protected settings?: FindSettings,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        super();
        settings = new FindSettings(settings);
        auth = auth || new AuthToken();
        super.init(baseUrl, settings, auth, fetchMethod);
        this.queryConverter = new FindQueryConverter();
    }

    /**
     * Fetches the search-result matches from the server.
     * Note that if a request callback has been setup then if it returns false the request is skipped.
     * @param query - The query-object that controls which results that are to be returned.
     * @param suppressCallbacks - Set to true if you have defined callbacks, but somehow don't want them to be called.
     * @returns a Promise that when resolved returns a string array of suggestions (or undefined if a callback stops the request).
     */
    public fetch(
        query: Query = new Query(),
        suppressCallbacks: boolean = false
    ): Promise<Matches> {
        let url = this.queryConverter.getUrl(
            this.baseUrl,
            this.settings.url,
            new Query(query)
        );
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            return this.fetchMethod(url, reqInit)
                .then((response: Response) => {
                    if (!response.ok) {
                        throw Error(
                            `${response.status} ${
                                response.statusText
                            } for request url '${url}'`
                        );
                    }
                    return response.json();
                })
                .then((matches: Matches) => {
                    this.cbSuccess(suppressCallbacks, matches, url, reqInit);
                    return matches;
                })
                .catch((error: any) => {
                    this.cbError(suppressCallbacks, error, url, reqInit);
                    throw error;
                });
        } else {
            // TODO: When a fetch is stopped due to cbRequest returning false, should we:
            // 1) Reject the promise (will then be returned as an error).
            // or
            // 2) Resolve the promise (will then be returned as a success).
            // or
            // 3) should we do something else (old code returned undefined...)
            return Promise.resolve(null);
        }
    }

    public clientIdChanged(oldValue: string, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.clientIdChanged) {
            this.update(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.dateFromChanged) {
            this.update(query);
        }
    }

    public dateToChanged(oldValue: DateSpecification, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.dateToChanged) {
            this.update(query);
        }
    }

    public filtersChanged(oldValue: Filter[], query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.filterChanged) {
            this.update(query);
        }
    }

    public matchGenerateContentChanged(oldValue: boolean, query: Query) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.matchGenerateContentChanged
        ) {
            this.update(query);
        }
    }

    public matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: Query
    ) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.matchGenerateContentChanged &&
            this.settings.triggers.matchGenerateContentHighlightsChanged
        ) {
            this.update(query);
        }
    }

    public matchGroupingChanged(oldValue: boolean, query: Query) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.matchGroupingChanged
        ) {
            this.update(query);
        }
    }

    public matchOrderByChanged(oldValue: OrderBy, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.matchOrderByChanged) {
            this.update(query);
        }
    }

    public matchPageChanged(oldValue: number, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.matchPageChanged) {
            this.update(query);
        }
    }

    public matchPageSizeChanged(oldValue: number, query: Query) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.matchPageSizeChanged
        ) {
            this.update(query);
        }
    }

    public queryTextChanged(oldValue: string, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.queryChange) {
            if (
                query.queryText.length >
                this.settings.triggers.queryChangeMinLength
            ) {
                if (
                    this.settings.triggers.queryChangeInstantRegex &&
                    this.settings.triggers.queryChangeInstantRegex.test(
                        query.queryText
                    )
                ) {
                    this.update(query);
                    return;
                } else {
                    if (this.settings.triggers.queryChangeDelay > -1) {
                        this.update(
                            query,
                            this.settings.triggers.queryChangeDelay
                        );
                        return;
                    }
                }
            }
        }
        clearTimeout(this.delay);
    }

    public searchTypeChanged(oldValue: SearchType, query: Query) {
        if (this.shouldUpdate() && this.settings.triggers.searchTypeChanged) {
            this.update(query);
        }
    }

    public uiLanguagecodeChanged(oldValue: string, query: Query) {
        if (
            this.shouldUpdate() &&
            this.settings.triggers.uiLanguageCodeChanged
        ) {
            this.update(query);
        }
    }
}
