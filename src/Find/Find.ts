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
import { FindSettings, IFindSettings } from "./FindSettings";
import { IMatches } from "../Data";

/**
 * The Find service queries the search-engine for search-matches for the given query.
 *
 * It is normally used indirectly via the SearchClient class.
 */
export class Find extends BaseCall<IMatches> {
    public settings: IFindSettings;

    private queryConverter: FindQueryConverter;

    /**
     * Creates a Find instance that handles fetching matches dependent on settings and query.
     * @param settings - The settings that define how the Find instance is to operate.
     * @param auth - An auth-object that handles the authentication.
     */
    constructor(
        settings: IFindSettings | string,
        auth?: AuthToken,
        fetchMethod?: Fetch
    ) {
        super(); // dummy
        // prepare for super.init
        settings = new FindSettings(settings);
        auth = auth || new AuthToken();
        super.init(settings, auth, fetchMethod);
        // Set own this props
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
    ): Promise<IMatches> {
        let url = this.queryConverter.getUrl(
            this.settings.url,
            new Query(query)
        );
        let reqInit = this.requestObject();

        if (this.cbRequest(suppressCallbacks, url, reqInit)) {
            this.fetchQuery = new Query(query);
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
                .then((matches: IMatches) => {
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
        if (!this.shouldUpdate("clientId", query)) {
            return;
        }
        if (this.settings.triggers.clientIdChanged) {
            this.update(query);
        }
    }

    public dateFromChanged(oldValue: DateSpecification, query: Query) {
        if (!this.shouldUpdate("dateFrom", query)) {
            return;
        }
        if (this.settings.triggers.dateFromChanged) {
            this.update(query);
        }
    }

    public dateToChanged(oldValue: DateSpecification, query: Query) {
        if (!this.shouldUpdate("dateTo", query)) {
            return;
        }
        if (this.settings.triggers.dateToChanged) {
            this.update(query);
        }
    }

    public filtersChanged(oldValue: Filter[], query: Query) {
        if (!this.shouldUpdate("filters", query)) {
            return;
        }
        if (this.settings.triggers.filtersChanged) {
            this.update(query);
        }
    }

    public matchGenerateContentChanged(oldValue: boolean, query: Query) {
        if (!this.shouldUpdate("matchGenerateContent", query)) {
            return;
        }
        if (this.settings.triggers.matchGenerateContentChanged) {
            this.update(query);
        }
    }

    public matchGenerateContentHighlightsChanged(
        oldValue: boolean,
        query: Query
    ) {
        if (!this.shouldUpdate("matchGenerateContentHighlights", query)) {
            return;
        }
        if (
            this.settings.triggers.matchGenerateContentChanged &&
            this.settings.triggers.matchGenerateContentHighlightsChanged
        ) {
            this.update(query);
        }
    }

    public matchGroupingChanged(oldValue: boolean, query: Query) {
        if (!this.shouldUpdate("matchGrouping", query)) {
            return;
        }
        if (this.settings.triggers.matchGroupingChanged) {
            this.update(query);
        }
    }

    public matchOrderByChanged(oldValue: OrderBy, query: Query) {
        if (!this.shouldUpdate("matchOrderBy", query)) {
            return;
        }
        if (this.settings.triggers.matchOrderByChanged) {
            this.update(query);
        }
    }

    public matchPageChanged(oldValue: number, query: Query) {
        if (!this.shouldUpdate("matchPage", query)) {
            return;
        }
        if (this.settings.triggers.matchPageChanged) {
            this.update(query, null, true);
        }
    }

    public matchPageSizeChanged(oldValue: number, query: Query) {
        if (!this.shouldUpdate("matchPageSize", query)) {
            return;
        }
        if (this.settings.triggers.matchPageSizeChanged) {
            this.update(query);
        }
    }

    public queryTextChanged(oldValue: string, query: Query) {
        if (!this.shouldUpdate("queryText", query)) {
            return;
        }
        if (this.settings.triggers.queryChange) {
            if (
                query.queryText.trim().length >
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
        if (!this.shouldUpdate("searchType", query)) {
            return;
        }
        if (this.settings.triggers.searchTypeChanged) {
            this.update(query);
        }
    }

    public uiLanguageCodeChanged(oldValue: string, query: Query) {
        if (!this.shouldUpdate("uiLanguageCode", query)) {
            return;
        }
        if (this.settings.triggers.uiLanguageCodeChanged) {
            this.update(query);
        }
    }
}
