import { AuthToken } from "../Authentication";
import { Fetch } from "../Common";
import { IAutocompleteSettings, RestAutocomplete, HapiAutocomplete } from '.';

export class AutocompleteFactory {
  public create(
    settings: IAutocompleteSettings,
    auth?: AuthToken,
    fetchMethod?: Fetch
    ): RestAutocomplete | HapiAutocomplete {    
    if (settings.mode === "rest") {
        const restFind = new RestAutocomplete(
            settings,
            auth,
            fetchMethod
        );
        return restFind;
    } else if (settings.mode === "hapi") {
        const hapiFind = new HapiAutocomplete(
            settings,
            auth,
            fetchMethod
        );
        return hapiFind;
    } else {
      throw new Error('Autocomplete: Select either a Rest or a Hapi client type.');
    }
  }
}