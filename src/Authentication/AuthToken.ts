/**
 * This class defines the auth-token that all the services in the SearchClient instance passes along it's serverside lookups.
 */
export class AuthToken {
    /**
     * When defined will contain the Json Web Token that is to be used to authenticate the rest-calls to the search-service.
     */
    public authenticationToken?: string = undefined;
}
