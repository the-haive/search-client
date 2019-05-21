import { AuthToken } from "./AuthToken";
import { OidcAuthentication } from "./OidcAuthentication";
import { JwtAuthentication } from "./JwtAuthentication";
import { Fetch } from "../Common";

import {    
    IAuthenticationSettings
} from "./AuthenticationSettings";

export class AuthenticationFactory {
  public create(settings: IAuthenticationSettings,
                auth?: AuthToken,
                fetchMethod?: Fetch): JwtAuthentication | OidcAuthentication {    
    if (settings.type === "oidc") {
        const oidcAuthentication = new OidcAuthentication(
            settings,
            auth,
            fetchMethod
        );
        return oidcAuthentication;
    } else if (settings.type === "jwt") {
        const jwtAuthentication = new JwtAuthentication(
            settings,
            auth,
            fetchMethod
        );
        return jwtAuthentication;
    } else {
      throw new Error('Select either a OIDC or a JWT authentication type.');
    }
  }
}