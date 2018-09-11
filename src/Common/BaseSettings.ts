export interface IBaseSettings<TDataType> {
    /**
     * A notifier method to call whenever the lookup fails.
     * @param error - An error object as given by the fetch operation.
     */
    cbError?: (error?: any) => void;

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
     * A notifier method to call whenever the lookup results have been received.
     * @param data - The lookup results.
     */
    cbSuccess?: (data?: TDataType) => void;

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

    readonly url?: string;
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
     * @param error - An error object as given by the fetch operation.
     */
    public cbError?: (error?: any) => void;

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
     * A notifier method to call whenever the lookup results have been received.
     * @param data - The lookup results.
     */
    public cbSuccess?: (data?: TDataType) => void;

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
        let url = new URL(parts.join("/"));
        return url.toString();
    }

    /**
     * Handles the construction of the base-settings class with its properties.
     *
     * @param settings The settings that are to be set up for the base settings class.
     */
    protected init(settings: IBaseSettings<TDataType>): void {
        if (
            typeof settings.baseUrl === "undefined" ||
            typeof settings.servicePath === "undefined"
        ) {
            throw Error(
                "Must have settings, with baseUrl, basePath and servicePath."
            );
        }
        this.enabled =
            typeof settings.enabled !== "undefined" ? settings.enabled : true;

        this.baseUrl = settings.baseUrl.replace(/\/+$/, "");

        this.basePath =
            typeof settings.basePath !== "undefined"
                ? settings.basePath.replace(/(^\/+)|(\/+$)/g, "")
                : "RestService/v4";

        this.servicePath = settings.servicePath.replace(/(^\/+)|(\/+$)/g, "");

        this.cbError = settings.cbError;
        this.cbRequest = settings.cbRequest;
        this.cbSuccess = settings.cbSuccess;
    }
}
