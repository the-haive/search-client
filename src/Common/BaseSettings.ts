//import { VersionPathSettings } from './VersionPathSettings';
/**
 * A common settings base-class for the descending Autocomplete, Categorize and Find settings classes.
 *
 * @param TDataType Defines the data-type that the descendant settings-class needs to return on lookups.
 */
export abstract class BaseSettings<TDataType> {
    //} extends VersionPathSettings {

    /**
     * A notifier method to call whenever the lookup fails.
     * @param error - An error object as given by the fetch operation.
     */
    public cbError?: (error?: any) => void = undefined;

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
    public cbRequest?: (
        url?: string,
        reqInit?: RequestInit
    ) => boolean = undefined;

    /**
     * A notifier method to call whenever the lookup results have been received.
     * @param data - The lookup results.
     */
    public cbSuccess?: (data?: TDataType) => void = undefined;

    /**
     * Whether or not this setting-feature is enabled or not.
     */
    public enabled?: boolean = true;

    /**
     * You can use this path to override the path to the rest-service.
     * If not set, it will default to "RestService/v" and whatever `this.version` is set to.
     * If it is set it will use the set path verbatim, without appending `this.version`.
     */
    public path?: string = "RestService/v4";

    /**
     * Handles the construction of the base-settings class with its properties.
     *
     * @param settings The settings that are to be set up for the base settings class.
     */
    constructor(settings?: BaseSettings<TDataType>) {
        if (settings) {
            this.enabled =
                typeof settings.enabled !== "undefined"
                    ? settings.enabled
                    : this.enabled;
            this.cbError =
                typeof settings.cbError !== "undefined"
                    ? settings.cbError
                    : this.cbError;
            this.cbRequest =
                typeof settings.cbRequest !== "undefined"
                    ? settings.cbRequest
                    : this.cbRequest;
            this.cbSuccess =
                typeof settings.cbSuccess !== "undefined"
                    ? settings.cbSuccess
                    : this.cbSuccess;
            this.path =
                typeof settings.path !== "undefined"
                    ? settings.path.replace(/(^\/+)|(\/+$)/g, "")
                    : this.path;
        }
    }
}
