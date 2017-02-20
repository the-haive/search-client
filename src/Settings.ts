import { AutocompleteSettings } from './AutocompleteSettings';
import { QuerySettings } from './QuerySettings';
import { Matches } from './Matches';
import { Categories } from './Categories';
import { UrlSettings } from './UrlSettings';

/**
 * Settings as used by the SearchClient.
 */
export class Settings {
    /** 
     * The JWT authentication token to use. 
     */
    public authenticationToken: string;

    /**
     * The default autocomplete settings to be used for autocomplete() lookups.
     */
    public autocomplete: AutocompleteSettings;

    /**
     * The default query-settings to be used for find() and categorize() calls. 
     */
    public query: QuerySettings;

    /**
     * Options for overriding the url for the various search endpoints.
     */
    public url: UrlSettings;

    /**
     * Creates an instance of Settings.
     */
    constructor(settings?: Settings) {
        settings = settings || {} as Settings;
        this.authenticationToken = settings.authenticationToken;
        this.autocomplete = settings.autocomplete !== undefined ? settings.autocomplete : {} as AutocompleteSettings;
        this.query        = settings.query        !== undefined ? settings.query        : {} as QuerySettings;
        this.url          = settings.url          !== undefined ? settings.url          : {} as UrlSettings;
    }
}
