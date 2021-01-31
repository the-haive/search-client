# Getting started

## Basics

This section will cover only the basics. We highly recommend using the API-documentation for more details and insight.

The two central classes are SearchClient and Settings:

### SearchClient

The central class is the [[SearchClient]]. To start using it you will need to create a new instance of it.

**Note: If you are embedding the library via a script-tag then all the library features are in the Haive namespace.**

The constructor takes one parameter (`settings`: [[ISettings]]), where at least the [[Settings.baseUrl]] must be set.

The settings interface has properties that help you customize the solution to your needs. The `baseUrl` is typically `"http://<your-server>:9950"` for the Haive SearchManager.

We recommend using the automatic mode, where you only need to interface with the SearchClient class and it's settings.

### Settings

The [[Settings]] class has the following properties:

- `baseUrl`: string - The base url for the endpoint (domain + port only).
- `basePath`: string - The path (default usually is correct: `"RestService/v4)"`
- `authentication`: [[AuthenticationSettings]] - Defines how `authentication`-calls are handled
- `autocomplete`: [[AutocompleteSettings]] - Defines how `autocomplete`-calls are handled
- `categorize`: [[CategorizeSettings]] - Defines how `categorize`-calls are handled
- `find`: [[FindSettings]] - Defines how `find`-calls are handled
- `query`: [[Query]] - Defines the default query-options.\

Please consult the documentation for specific details on each of them. Suffice to say that all the `*Settings` classes contains a boolean property called `enabled`, which by default is `true`.

## Automatic mode

The automatic mode is by far the simplest and sexiest way for you as a developer to use the search-client. It makes it very easy for you to hook up your search-ui to the search-backend, without you having to add source code to detect when and how the various features are to be executed. Instead you can "stand on our shoulders" and leverage the knowledge that is already incorporated into the implemented automated triggers. You can set things up and it should "just work". We do however suggest that you invest time into understanding the various search-features and how the the triggers work. That will help you find the best way to implement the search-backend for your needs.

### Set up triggers

The `Autocomplete`, `Categorize`, `Find` (and optionally also the `authentication`) services are all essential parts of the automatic mode. Because of this their respective settings objects also contain a property called `trigger`:

- [[AutocompleteTriggers]]</a>
- [[CategorizeTriggers]]</a>
- [[FindTriggers]]</a>
- [[AuthenticationTriggers]]</a>

We suggest spending time on examining the triggers for the respective services above.

### Set up callbacks

The automatic mode operations (autocomplete, categorize and find) also allow you to specify callbacks as a part of the configuration. The callbacks can be used in the manual mode too, but they were designed to be part of the automatic mode primarily.

1. `cbRequest`
   This callback is called before the request is started. Typically you will use this to control loading/waiting indicators on the page. The signature includes some optional params `(url: string, reqInit: RequestInit): bool`.

    **Note that if you add this callback, and explicitly return false, then the request will not be executed.**

If you don't return or return false then the request runs as expected.

1. `cbSuccess`
   This callback is called whenever a backend operation has completed and results have been received. The signature of the callback should be `(data: <TDataType>) => void`, where the &lt;TDataType&gt; is `string[]` for the autocomplete call, `ICategories` for the categorize call and `IMatches` for the find call.

1. `cbError`
   This callback is called whenever a backend operation somehow fails to complete. The signature of the callback should be `(error: any) => void`. The error object could be anything, but should explain the cause of the problem if console.log()'ed or toString()'ed to the page.

It is important to understand that Authentication, Autocomplete, Categorize and Find all have independent callbacks in the configuration. Because of this the success, error and busy-state for each of them can be tracked independently. This means that the query-field may have an indicator somewhere that indicates that it is doing a lookup (if wanted). The categories section may have an indicator to tell that it is working, and finally the results area may also have an indicator telling that results are pending.

### Handling user input

In order for the automatic mode to work you need to update the values in your query-field as well as filters and/or sorting order / search-type. This is how the search-client will know when to execute searches/lookups and not.

These are the **properties** on the SearchClient class that you can manipulate in order to change the query that the search-client is to execute. It is expected that you both `set` and `get` them directly:

- `clientId`: string
- `dateFrom`: [[DateSpecification]]
- `dateTo`: [[DateSpecification]]
- `filters`: string[]
- `matchGenerateContent`: boolean
- `matchGenerateContentHighlights`: boolean
- `matchGrouping`: boolean
- `matchOrderBy`: [[OrderBy]]
- `matchPage`: number
- `matchPageSize`: number
- `maxSuggestions`: number
- `query`: [[Query]]
- `queryText`: string
- `searchType`: [[SearchType]]
- `uiLanguageCode`: string

I.e. `searchClient.queryText = "my query";`
The normal thing to do is to wire the UI events so that when the user changes the content of the query input field you immediately update the `queryText` property.

In addition the there are some additional methods that help manage changes in the UI:

- `toggleCategoryExpansion(...)` [[SearchClient.toggleCategoryExpansion]] - To toggle expanded/collapsed state for a category in the category-tree.
- `filterAdd(...)` [[SearchClient.filterAdd]] - To add a category as a filter
- `filterRemove(...)` [[SearchClient.filterRemove]] - To remove a category as a filter
- `filterToggle(...)` [[SearchClient.filterToggle]] - To toggle a category as a filter
- `isFilter(...)` [[SearchClient.isFilter]] - To check whether a given category-node is also a filter
- `hasChildFilter()` [[SearchClient.hasChildFilter]] - To check whether any child of a given category-node is a filter
- `matchPageNext()` [[SearchClient.matchPageNext]] - To go to the next page of matches
- `matchPagePrev()` [[SearchClient.matchPagePrev]] - To fgo back to the previous page of matches
- `update(...)` [[SearchClient.update]] - Typically called when the user clicks the search-button (or when i.e. the Enter-button has been pressed in the query-field). Will update the services according to changes in the query object (if any).
- `forceUpdate(...)` [[SearchClient.forceUpdate]] - Used to force an update - even if there has been no changes in the query.
- `reset()` [[SearchClient.reset]] - Resets the search-client instance back to the original startup state (handy to reset filters, query++)

## Deferring and suppressing registered callbacks

Please note that any of the services' registered callbacks will be called as a part of the fetch-process. This regards to both automatic and manual mode fetches. If you don't want the callbacks to be enabled you have two options:

1. For the SearchClient: Call `deferUpdates(true)` before you do anything that would normally trigger callbacks. This will in turn call `deferUpdates(true)` for all services. When you want callbacks to again be activated, call `deferUpdate(false)` method. When first param is false it optionally takes a second parameter that can be used to indicate whether pending updates are to be skipped or not.
1. For a specific service: Call its specific `deferUpdates(true)` before you do anything that would normally trigger callbacks. And then afterwards, if you want the callbacks to again be active, call `deferUpdates(false)` and use the second parameter to indicate whether pending updates are to be skipped or not.

Please see [[SearchClient.deferUpdates]] for more information.

## Authentication

The Haive SearchManager supports two modes of authentication:

1. Simple JWT based authentication
2. OpenId Connect based authentication

Both modes are described in details below. If the index is public and does not use authentication then you can turn off authentication (which is enabled by default) by passing this in the settings object in the SearchClient constructor: `authentication: { enabled: false }`.

## JWT Authentication

The Haive SearchManager supports JWT based (<a href="https://jwt.io/">JSON Web Token</a>) authentication for differentiating users/permissions. To use this kind of authentication:

1. The SearchManager must be configured to use the `CurrentPrincipal` plugin (which then extracts the authentication JWT package).

2. A web-service that identifies the user must be setup that is accessible from the page that the search-client runs on.

    - The web-service endpoint must identify the user and create a JWT that is returned.
    - On the server-side the JWT needs to be generated by using the same secret key as is set up in the SearchManager (a random key was generated on setup and should be pre-configured).
    - A choice must be made on the expiration time for the token. It is suggested to be liberal, but to still have an expiration time. An hour would probably be fine in many cases.
    - It is suggested that the creation time property in the JWT is backdated with a minute or so to cope for time variances between the SearchManager and this web-service.

3. The SearchClient authentication settings object must define:
    - Type set to 'jwt'
    - The endpoint url.
    - The path for the jwt value when returned.
      If the returned structure is `{ user: { jwt: "actualtokenhash" } }` then the tokenPath should be `[ "user", "jwt" ]`.
    - By default

The authentication system, when enabled will attempt to fetch the authentication-token as soon as it is setup (trying to pre-fetch it to have it ready asap in case a search is made).

The authentication system decodes the jwt-token when received and checks for when the token expires. It then sets up a timeout to fetch a new token in ample time before the current one expires. The overlap for this is defined in its triggers: `authentication: { triggers: { expiryOverlap: 60 } }`. The default is 60 seconds, which means that the client will try to get a new JWT 60 seconds before the old one expires.

Example:

"authentication": {
  "type": "jwt",
  "baseUrl": "auth_webservice_url",
  "servicePath": "auth/login",
  "enabled": true
}

## OpenId Connect Authentication

The Haive SearchManager supports OpenId Connect based authentication.

1. The SearchManager must be configured to use the `CurrentPrincipal` plugin (which then extracts the authentication JWT package).

2. A web-service that identifies the user must be setup that is accessible from the page that the search-client runs on.

    - Web service must support standard Open Id Connect flows.
    - Web service must expose discovery endpoint - which should return information like issuer name, key material and supported scopes.
    - The web-service endpoint must identify the user and create access_token for that user.
    - A choice must be made on the expiration time for the token. It is suggested to be liberal, but to still have an expiration time. An hour would probably be fine in many cases.
    - It is suggested that the creation time property in the JWT is backdated with a minute or so to cope for time variances between the SearchManager and this web-service.

3. The SearchClient authentication settings object must define:
    - Type set to oidc
    - Base url - the url of authority (identity server) supporting Open Id Connect protocol
    - Silent redirect url - the url for redirect in silent token renew operation
    - Redirect url - the url for redirect in login operation
    - Post logout redirect url - the url for redirect in logout operation
    - Service path - path of identity server service
    - Client Id - id of the client registered in identity server
    - Response type - describes response type to be returned by identity server
    - Response mode - describes server response mode ('fragment' for implicit flow, 'query' for authorization code flow)
    - Scopes - list of scopes requested by client
    - Enable logging flag

Implicit flow example:

 "authentication": {
  "type": "oidc",
  "baseUrl": "localhost:5000",
  "silentRedirectUri": "localhost:9000/silent.html",
  "redirectUri": "localhost:9000/callback.html",
  "postLogoutRedirectUri": "localhost:9000",
  "servicePath": "",
  "clientId": "haive.webclient.implicit",
  "scope": "openid profile",
  "responseType": "id_token token",
  "responseMode": "fragment",
  "enabled": true,
  "enableLogging": true
  }

  Authorization code flow example:

 "authentication": {
  "type": "oidc",
  "baseUrl": "localhost:5000",
  "silentRedirectUri": "localhost:9000/silent.html",
  "redirectUri": "localhost:9000/callback.html",
  "postLogoutRedirectUri": "localhost:9000",
  "servicePath": "",
  "clientId": "haive.webclient.implicit",
  "scope": "openid profile",
  "responseType": "id_token token",
  "responseMode": "query",
  "enabled": true,
  "enableLogging": true
  }

Example configuration is provided in samples\plain\cfg\search-settings-oidc.js config file.

## Documentation / Intellisense / Types

If you are using typescript, then the data-types are available for your IDE to use. If not, then all types and definitions are available in the generated API-documentation in the search-client docs-folder (typically `./node_modules/search-client/docs/index.html`).
