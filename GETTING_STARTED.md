# IntelliSearch SearchClient

## About
This package that makes it easy to connect to to an IntelliSearch index from javascript/typescript. 

The package handles all the backend operations and does not create any UI elements. It can be used in an npm like project, both for javascript and typescript projects. In addition, a browser-friendly version is available as a bundled option too, making it possible for webpages to just include it into their page as an ordinary script-tag element.

The IntelliSearch index is typically exposed via the IntelliSearch SearchService, which exposes some REST interfaces:

* Autocomplete - Lookups query-text and suggests words to help write the query.
* Find - Searches the index based on the current query (query-text, filters, ...).
* Categorize - Generates a category tree with counts based on the current query (query-text, filters, ...).

In addition, there are two other incomplete or experimental REST-interfaces exposed
* BestBets [incomplete] - Does not yet expose a full resource based interface for creating, reading, updating and deleting best-bet records. For now, only allows getting a list of all registered best-bets.
* AllCategories [experimental] - Generates the full tree of categories (for the current user and for all words in the index). Note: This interface is disabled by default in the SearchService. In order to use this feature in the SearchClient you will need to enable this in the SearchService.exe.config on the server.

## Getting started

1. Navigate to your project folder.

2. Run: `npm install --save search-client`

   This will install the package in the ./node_modules/search-client folder, relative to the current project.

3. If your implementation project is an npm-project then all you need to do is to start requiring/importing the search-client into your code.

4. If your project is a classic traditional webpage with javascript src-tags then copy the `./node_modules/search-client/dist/SearchClient.bundle.*` files into a folder that your webpage can use to include javascripts.

5. Implement using "Automatic solution", where you only do a minimum of wiring to make the solution work.   
   You report changes to the query-text, filters, page navigation, result sorting or search-type to the search-client instance. You then track the operations and receive results via registered callbacks.

6. Or, implement a "Manual solution", where you decide everything yourself.
   You execute each backend rest-call when you want to. You can choose whether to receive the results via callbacks or to consume the promises returned.

## Basics

This section will cover only the basics. I highly recommend using the API-documentation for more details and insight.

### <a href="./doc/classes/SearchClient.html">SearchClient</a>

The central class is the <a href="./doc/classes/SearchClient.html">SearchClient</a>. To start using it you will need to create a new instance of it. The constructor takes two parameters, a baseUrl and optionally a settings object. 

   * The base-url is typically "http://myserver/RestService/v3/" for IntelliSearch SearchService. 
   * The settings object has properties that help you customize the solution to your needs.
     * If you are using the "manual" mode with promises, then you can leave this empty.
     * If you want to use the "automatic" mode, then you will have to set up some of these properties.

### <a href="./doc/classes/Settings.html">Settings</a>

The <a href="./doc/classes/Settings.html">Settings</a> class holds properties as follows:

* `allCategories`: <a href="./doc/classes/AllCategoriesSettings.html">AllCategoriesSettings</a> 
* `authentication`: <a href="./doc/classes/AuthenticationSettings.html">AuthenticationSettings</a> 
* `autocomplete`: <a href="./doc/classes/AutocompleteSettings.html">AutocompleteSettings</a> 
* `bestBets`: <a href="./doc/classes/BestBetsSettings.html">BestBetsSettings</a> 
* `categorize`: <a href="./doc/classes/CategorizeSettings.html">CategorizeSettings</a> 
* `find`: <a href="./doc/classes/FindSettings.html">FindSettings</a> 
* `query`: <a href="./doc/classes/Query.html">Query</a> 

Please consult the documentation for specific details on each of them. Suffice to say that all the *Settings classes contains a boolean property called `enabled` , which by default is `true`. 

## Automatic mode

### Update input
In order for the automatic mode to work you need to update the values in your query-field as well as filters and/or sorting order / search-type.

These are **properties** on the SearchClient class and it is expected that you set and get them directly:

* `clientId`: string
* `dateFrom`: <a href="./doc/globals.html#datespecification">DateSpecification</a>
* `dateTo`: <a href="./doc/globals.html#datespecification">DateSpecification</a>
* `filters`: string[]
* `matchGrouping`: boolean
* `matchOrderBy`: <a href="./doc/enums/orderby.html">OrderBy</a>
* `matchPage`: number
* `matchPageSize`: number
* `maxSuggestions`: number
* `queryText`: string
* `searchType`: <a href="./doc/enums/searchtype.html">SearchType</a>

### Set up triggers

The `autocomplete`, `categorize` and `find` properties are all essential parts of the automatic mode. Because of this their respective settings objects also contain a property called `trigger`: 

* <a href="./doc/classes/AutocompleteTrigger.html">AutocompleteTrigger</a>
* <a href="./doc/classes/CategorizeTrigger.html">CategorizeTrigger</a>
* <a href="./doc/classes/FindTrigger.html">FindTrigger</a>

These triggers have a common set of properties, inherited from the <a href="./doc/classes/Trigger.html">Trigger</a> class:

* `queryChange`:\
  Trigger execution when the query changes.

* `queryChangeMinLength`:\
  Minimum query-text length before triggering execution.\
  **Note: Requires queryChange to be true.**

* `queryChangeDelay`:\
  Delay triggers for query-text changes until no change has been made for a certain time (in milliseconds). This is to avoid executing searches constantly while the user is typing.\
  **Note: Requires queryChange to be true.**

* `queryChangeInstantRegex`:\
  When this regex matches the query-text the change will trigger immediately instead of delaying the trigger (as defined above).\
  **Note: Requires queryChange to be true.**   
  **Note: Requires query to be longer than queryMinLength.**
  Default for Autocomplete: Trigger on first whitespace after non-whitespace.
  Default for Categorize/Find: Trigger on first ENTER after non-whitespace.

This means that in the passed Settings-object you can differentiate on when the backend operations are to be executed for each of them.

### Set up Callbacks

The automatic mode operations (autocomplete, categorize and find) also allow you to specify callbacks as a part of the configuration. The callbacks can be used in the manual mode too, but they were designed to be part of the automatic mode primarily. 

1. `cbSuccess`\
  This callback is called whenever a backend operation has completed and results have been received. The signature of the callback should be `(data: <dataType>) => void`, where the &lt;dataType&gt; is `string[]` for the autocomplete call, `Categories` for the categorize call and `Matches` for the find call.

2. `cbError`\
  This callback is called whenever a backend operation somehow fails to complete. The signature of the callback should be `(error: any) => void`. The error object could be anything, but should explain the cause of the problem if console.log()'ed or toString()'ed to the page.

3. `cbBusy`\
  This callback is designed to help you track when backend data is being requested. Typically you will use this to control loading/waiting indicators on the page. The signature has some more params, but these are merely for debugging purposes: `(isBusy: boolean, url: string, reqInit: RequestInit): void`. The isBusy parameter tells you whether the request is starting to load (`true`) or if it is done loading (`false`). The next two params can be practical when debugging to see which requests started and stopped when. Note: This indicator does not separate success from failure. It merely tracks whether or not something is pending or not. Every request should make two calls to this callback: One when the request starts and one when it finished (success or error).

It is important to understand that autocomplete, categorize and find all have independent callbacks in the configuration. Because of this the success, error and busy-state for each of them can be tracked independently. This means that the query-field may have an indicator somewhere that indicates that it is doing a lookup (if wanted). The categories section may have an indicator to tell that it is working, and finally the results area may also have an indicator telling that results are pending.

### Manual fetch

In the automatic mode, you will never normally use any of the webservice-operations directly. They will all be invoked indirectly as a result of you updating the input-values (as listed in the previous section).

The web-service properties are available though (as long as you didn't pass `enabled: false` for them in the settings object). Please note that the autocomplete, categorize and find web-services will by default call any registered callbacks a a part of the fetch-process. If you don't want the callbacks to be enabled for the fetch then you can pass a second variable to the fetch() call, a boolean `suppressCallbacks` parameter, set to `true`.

    // Sets suppressCallbacks to true via second param to fetch
    client.find.fetch({ queryText: "Hello world" }, true)
    .then((matches) => {
        console.log("Find results:", matches);
    })
    .catch((error) => {
        console.error(error);
    });

### Sample

    // Without authentication
    let client = new SearchClient("http://server/RestService/v3/", {
        authentication: {
            enables: false,
        }, 
        find: {
            cbBusy: (isBusy, url, reqInit) => {
                findLoading = isBusy; 
            },
            cbSuccess: (matches) => {
                findResults = matches;
            },
            cbError: (error) => {
                findError = error.toString();
            }, 
            trigger: {
                queryChanged: true // Means that the match-results will update on queryChanges, and according to the other default trigger values. Still needs minLength and triggerdelay is also obeyed. This example allows a kind of realtime search for matches.
            }
        },
        categorize: {
            cbBusy: (isBusy, url, reqInit) => {
                categorizeLoading = isBusy; 
            },
            cbSuccess: (categories) => {
                categorizeResults = categories;
            },
            cbError: (error) => {
                categorizeError = error.toString();
            },
            trigger: {
                // Here we don't change the triggers. queryChange is false so it will not "autosearch".
            }
        },
        autocomplete: {
            enabled: false // for this example we turn off autocomplete
        }
    });

    // Sets the queryText, which dependent on the setting triggers may or may not invoke a fetch on the various web-services.
    // In this scenario autocomplete is not looked up since it is disabled in the settings object.
    client.queryText = "hello world";

    // The user clicks the Search-button and a find and categorize should be executed. 
    client.go();

    // The registered callbacks passed to the SearchClient constructor will be called automatically to track the progress and deliver results when returned. 

## Manual mode

### Update input

_N/A for the manual mode._

### Set up triggers

_N/A for the manual mode._

### Set up callbacks

While it is possible to set up callbacks to handle the results of the manual fetches, it is not the recommended practice. We suggest that you instead use the Promises returned (see sample below).

### Manual fetch

In manual mode, you control which web-service to call when yourself. This is what the manual mode is all about. The typical mode of operation is still to instantiate the central SearchClient class, but to call the web-services via their respective search-client instance properties: allCategories.fetch(), authentication.fetch(), autocomplete.fetch(), bestBets.fetch(), categorize.fetch() and find.fetch().

Please note that the autocomplete, categorize and find web-services will by default call any registered callbacks as a part of the fetch-process. If you don't want the callbacks to be enabled for the fetch then you can pass a second variable to the fetch()call, a boolean `suppressCallbacks` parameter, set to `true`.

### Sample

    let client = new SearchClient("http://server/RestService/v3/");

    client.find.fetch({ queryText: "Hello world" })
    .then((matches) => {
        console.log("Find results:", matches);
    })
    .catch((error) => {
        console.error(error);
    });

It is recommended to use Promises as shown in the sample above when doing manual operations.

## Authentication

The IntelliSearch SearchService supports using JWT (JsonWebToken) authentication for differentiating users/permissions. If the index is public and does not use authentication then you can turn off authentication (which is enabled by default) by passing this in the settings object in the SearchClient constructor: `authentication: { enabled: false }`.

If you however want to use authentication, then there are a couple of things that is important:

1. The SearchService must be configured to use the CurrentPrincipal plugin.

2. A web-service that identifies the user must be setup that is accessible from the page that the search-client runs on.
   - The web-service endpoint must identify the user and create a JWT that is returned.
   - On the server-side the JWT needs to be generated by using the same secret key as is set up in the SearchService (a random key was generated on setup and should be preconfigured).
   - A choice must be made on the expiration time for the token. It is suggested to be liberal, but to still have an expiration time. An hour would probably be fine in many cases.
   - It is suggested that the creation time property in the JWT is backdated with a minute or so to cope for time variances between the SearchService and this web-service.

3. The SearchClient authentication settings object must define:
   - The endpoint url.
   - The path for the jwt value when returned.\
     If the returned structure is `{ user: { jwt: "actualtokenhash"}}` then the tokenPath should be `["user", "jwt"]`.
   - By default

The authentication system, when enabled will attempt to fetch the authentication-token as soon as it is setup (trying to prefetch it to have it ready asap in case a search is made). 

The authentication system decodes the jwt-token when received and checks for when the token expires. It then sets up a timeout to fetch a new token in ample time before the current one expires. The overlap for this is defined in its trigger: ` authentication: { trigger: { expiryOverlap: 60 }}`. The default is 60 seconds, which means that the client will try to get a new JWT 60 seconds before the old one expires.

## Documentation / Intellisense / Types
If you are using typescript, then the datatypes are available for your IDE to use. If not, then all types and definitions are available in the generated API-documentation in the search-client doc-folder (typically ./node_modules/search-client/doc/index.html).

---
**Please report bugs on the GitHub project: http://www.github.com/intellisearch/search-client**
