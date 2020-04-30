import { AuthToken } from "../Authentication";
import { Fetch } from "../Common";
import { HapiCategorize } from './HapiCategorize';
import { RestCategorize } from './RestCategorize';
import { ICategorizeSettings } from './CategorizeSettings';

export class CategorizeFactory {
  public create(
            settings?: ICategorizeSettings,
            auth?: AuthToken,
            fetchMethod?: Fetch
        ): RestCategorize | HapiCategorize {    
    if (settings.mode === "rest") {
        const restFind = new RestCategorize(
            settings,
            auth,
            fetchMethod
        );
        return restFind;
    } else if (settings.mode === "hapi") {
        const hapiFind = new HapiCategorize(
            settings,
            auth,
            fetchMethod
        );
        return hapiFind;
    } else {
      throw new Error('Categorize: Select either a Rest or a Hapi client type.');
    }
  }
}