/**
 * This class defines the auth-token that all the services in the SearchClient instance passes along it's serverside lookups.
 */
export class AuthToken {
    /**
     * Getter will call token resolver to obtain the Json Web Token that is to be used to authenticate the rest-calls to the search-service.
     */   
    get authenticationToken(): string {        
        return this.tokenResolver instanceof Function ? this.tokenResolver() : "";
    }    

    public tokenResolver: () => string; 
}
