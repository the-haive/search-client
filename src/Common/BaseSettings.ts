import 'url-polyfill';
import { QueryChangeSpecifications } from './QueryChangeSpecifications';
import { IQuery } from './Query';
import { IWarning } from './BaseCall';

export interface IBaseSettings<TDataType> {
    /**
     * A notifier method to call whenever the lookup fails.
     * It is recommended to issue a clear and visible error to the user when this method is called, as there will be no results.
     *
     * The callback exists for all services (Authentication, Autocomplete, Find and Categorize), but the severity of an error is
     * very different for each of them:
     *
     * - Authentication (severity = 3):
     *   This should not happen if authentication is not enabled. If it is and this fails, then the user should be notified about
     *   the issue, as this might reduce the number of results they see (if any at all).
     *
     * - Autocomplete (severity = 1):
     *   Getting an error during autocomplete is not something that you want to inform the user about. A small warning in the
     *   console log would probably be perfect.
     *
     * - Find (severity = 3):
     *   Getting an error for this call is something that the user should be made aware of. You don't have to tell all the
     *   details, but you should make it clear to the user that the reason they have no matches is that an error occurred.
     *   Otherwise they might start speculating in why there are no results on screen, and in worst case scenario they might
     *   think that the query yielded 0 matches, which is potentially and probably not the truth.
     *
     * - Categorize (severity = 2):
     *   Errors while querying for categories are considered important, but less important than the Find errors. The reason
     *   is that the categories themselves are normally not the end-results that the user is waiting for. They are "meta" to the
     *   actual matches, and they are also a tool to help the user narrow down on the results, helping them find the data they
     *   are looking for.
     *
     * @param error - An error object as given by the fetch operation.
     */
    cbError?: (error?: any) => void;

    /**
     * A notifier method to call when the lookup succeeds, but the received data from the backend indicates a problem.
     * Note that although this callback can be defined in the settings for all services (Authentication, Autocomplete, Find and
     * Categorize), only Find and Categorize uses it.
     *
     * It is recommended to show these messages as complementary information to the user. Data was received and most likely the
     * user can see results on their screen. There might however be scenarios were the data could somehow be i.e. incomplete.
     *
     * For instance: Consider a situation where the backend search is scaled and uses multiple nodes without replicas. If some
     * of the nodes respond, while one or more doesn't then the results are partial. This will be notified using this method.
     * For that scenario, an explanation at a strategic location in the UI would help the user understand that the results may
     * not be complete. Depending on the search query used, the results *could* be complete, as the node(s) that didn't respond
     * might not have any matching results anyway. Hence - the user should be warned that the data *may* be incomplete.
     *
     * @param warning - A warning object containing a message and a statusCode.
     */
    cbWarning?: (warning?: IWarning) => void;

    /**
     * A notifier method that is called just before the fetch operation is started. When the request
     * is finished either cbSuccess or cbError will be called to indicate success or failure.
     * This callback is typically used for setting loading indicators and/or debugging purposes.
     *
     * Note: If the callback returns false then the fetch operation is skipped. This can then be used
     * to conditionally drop requests from being made.
     *
     * @param url - This is the url that is/was fetched. Good for debugging purposes.
     * @param reqInit - This is the RequestInit object that was used for the fetch operation.
     */
    cbRequest?: (url?: string, reqInit?: RequestInit) => boolean;

    /**
     * A notifier method that is called whenever the lookup results have been received.
     *
     * @param data - The lookup results.
     */
    cbSuccess?: (data?: TDataType) => void;

    /**
     * A notifier method that is called whenever significant parts of the query has changed, and due to trigger settings, new results has yet not been requested.
     * When called the UI could/should indicate that the results are invalid. This can be removing the results, showing them "greyed out", etc.
     * The state is valid until the next cbRequest, cbSuccess or cbError is called.
     *
     * @param invalid - This indicates if the state-notification is invalid or not
     * @param fetchedQuery - This is the query that was used to create the current results.
     * @param futureQuery - This is the query that has not yet resulted in an update of the results.
     */
    cbResultState?: (
        invalid: boolean,
        fetchedQuery: IQuery,
        futureQuery: IQuery,
    ) => void;

    /**
     * Whether or not this setting-feature is enabled or not.
     */
    enabled?: boolean;

    /**
     * The baseUrl for the rest-service.
     */
    baseUrl?: string;

    /**
     * You can use this path to override the path to the rest-service.
     * If not set, it will default to "RestService/v" and whatever `this.version` is set to.
     * If it is set it will use the set path verbatim, without appending `this.version`.
     */

    basePath?: string;

    /**
     * The service-specific path added to the base-path.
     */
    servicePath?: string;

    /**
     * Defines the enum bit-field flags that signifies which query-fields that may resolve in changed results (both Categorize and Find).
     */
    queryChangeSpecs?: QueryChangeSpecifications;

    url?: string;
}

/**
 * A common settings base-class for the descending Autocomplete, Categorize and Find settings classes.
 *
 * @param TDataType Defines the data-type that the descendant settings-class needs to return on lookups.
 */
export abstract class BaseSettings<TDataType>
    implements IBaseSettings<TDataType> {
    /**
     * A notifier method to call whenever the lookup fails.
     * It is recommended to issue a clear and visible error to the user when this method is called, as there will be no results.
     *
     * The callback exists for all services (Authentication, Autocomplete, Find and Categorize), but the severity of an error is
     * very different for each of them:
     *
     * - Authentication (severity = 3):
     *   This should not happen if authentication is not enabled. If it is and this fails, then the user should be notified about
     *   the issue, as this might reduce the number of results they see (if any at all).
     *
     * - Autocomplete (severity = 1):
     *   Getting an error during autocomplete is not something that you want to inform the user about. A small warning in the
     *   console log would probably be perfect.
     *
     * - Find (severity = 3):
     *   Getting an error for this call is something that the user should be made aware of. You don't have to tell all the
     *   details, but you should make it clear to the user that the reason they have no matches is that an error occurred.
     *   Otherwise they might start speculating in why there are no results on screen, and in worst case scenario they might
     *   think that the query yielded 0 matches, which is potentially and probably not the truth.
     *
     * - Categorize (severity = 2):
     *   Errors while querying for categories are considered important, but less important than the Find errors. The reason
     *   is that the categories themselves are normally not the end-results that the user is waiting for. They are "meta" to the
     *   actual matches, and they are also a tool to help the user narrow down on the results, helping them find the data they
     *   are looking for.
     *
     * @param error - An error object as given by the fetch operation.
     */
    public cbError?: (error?: any) => void;

    /**
     * A notifier method to call when the lookup succeeds, but the received data from the backend indicates a problem.
     * Note that although this callback can be defined in the settings for all services (Authentication, Autocomplete, Find and
     * Categorize), only Find and Categorize uses it.
     *
     * It is recommended to show these messages as complementary information to the user. Data was received and most likely the
     * user can see results on their screen. There might however be scenarios were the data could somehow be i.e. incomplete.
     *
     * For instance: Consider a situation where the backend search is scaled and uses multiple nodes without replicas. If some
     * of the nodes respond, while one or more doesn't then the results are partial. This will be notified using this method.
     * For that scenario, an explanation at a strategic location in the UI would help the user understand that the results may
     * not be complete. Depending on the search query used, the results *could* be complete, as the node(s) that didn't respond
     * might not have any matching results anyway. Hence - the user should be warned that the data *may* be incomplete.
     *
     * @param warning - A warning object containing a message and a statusCode.
     */
    cbWarning?: (warning?: IWarning) => void;

    /**
     * A notifier method that is called just before the fetch operation is started. When the request
     * is finished either cbSuccess or cbError will be called to indicate success or failure.
     * This callback is typically used for setting loading indicators and/or debugging purposes.
     *
     * Note: If the callback returns false then the fetch operation is skipped. This can then be used
     * to conditionally drop requests from being made.
     *
     * @param url - This is the url that is/was fetched. Good for debugging purposes.
     * @param reqInit - This is the RequestInit object that was used for the fetch operation.
     */
    public cbRequest?: (url?: string, reqInit?: RequestInit) => boolean;

    /**
     * A notifier method that is called whenever the lookup results have been received.
     *
     * @param data - The lookup results.
     */
    public cbSuccess?: (data?: TDataType) => void;

    /**
     * A notifier method to call whenever significant parts of the query has changed, and due to trigger settings, new results has yet not been requested.
     * When called the UI could/should indicate that the results are invalid. This can be removing the results, showing them "greyed out", etc.
     * The state is valid until the next cbRequest, Success or cbError is called.
     *
     * @param valid - This indicates if the queries passed are equal or not.
     * @param fetchedQuery - This is the query that was used to create the current results.
     * @param futureQuery - This is the query that has not yet resulted in an update of the results.
     */
    cbResultState?: (
        valid: boolean,
        fetchedQuery: IQuery,
        futureQuery: IQuery,
    ) => void;

    /**
     * Whether or not this setting-feature is enabled or not.
     */
    public enabled: boolean;

    /**
     * The baseUrl for the rest-service.
     */
    public baseUrl: string;

    /**
     * You can use this path to override the path to the rest-service.
     * If not set, it will default to "RestService/v4".
     */

    public basePath: string;

    /**
     * The service-specific path added to the base-path.
     */
    public servicePath: string;

    /**
     * Defines the enum bit-field flags that signifies which query-fields that may resolve in changed results (both Categorize and Find).
     */
    public queryChangeSpecs: QueryChangeSpecifications;

    /**
     * Returns the actual url for the service.
     */
    public get url(): string {
        let parts: string[] = [];
        parts.push(this.baseUrl);
        if (this.basePath) {
            parts.push(this.basePath);
        }
        if (this.servicePath) {
            parts.push(this.servicePath);
        }
        let url = new URL(parts.join('/'));
        return url.toString();
    }
    public set url(value: string) {
        // Do nothing
    }
    /**
     * Handles the construction of the base-settings class with its properties.
     *
     * @param settings The settings that are to be set up for the base settings class.
     */
    protected init(settings: IBaseSettings<TDataType>): void {
        if (
            typeof settings.baseUrl === 'undefined' ||
            typeof settings.servicePath === 'undefined'
        ) {
            throw Error(
                'Must have settings, with baseUrl, basePath and servicePath.',
            );
        }
        this.enabled =
            typeof settings.enabled !== 'undefined' ? settings.enabled : true;

        this.baseUrl = settings.baseUrl.replace(/\/+$/, '');

        this.basePath =
            typeof settings.basePath !== 'undefined'
                ? settings.basePath.replace(/(^\/+)|(\/+$)/g, '')
                : 'RestService/v4';

        this.servicePath = settings.servicePath.replace(/(^\/+)|(\/+$)/g, '');

        this.cbWarning = settings.cbWarning;
        this.cbError = settings.cbError;
        this.cbRequest = settings.cbRequest;
        this.cbSuccess = settings.cbSuccess;
        this.cbResultState = settings.cbResultState;
    }
}
