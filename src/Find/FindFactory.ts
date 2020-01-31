import { IFindSettings } from "./FindSettings";

import { RestFind } from "./RestFind";
import { HapiFind } from "./HapiFind";

import { AuthToken } from "../Authentication";
import { Fetch } from "../Common";

export class FindFactory {
  public create(settings: IFindSettings,
                auth?: AuthToken,
                fetchMethod?: Fetch): RestFind | HapiFind {    
    if (settings.mode === "rest") {
        const restFind = new RestFind(
            settings,
            auth,
            fetchMethod
        );
        return restFind;
    } else if (settings.mode === "hapi") {
        const hapiFind = new HapiFind(
            settings,
            auth,
            fetchMethod
        );
        return hapiFind;
    } else {
      throw new Error('Select either a Rest or a Hapi client type.');
    }
  }
}