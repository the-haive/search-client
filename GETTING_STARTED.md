# Getting started

## Basics

This section will cover only the basics. We highly recommend using the API-documentation for more details and insight.

The two central classes are SearchClient and Settings:

### <a href="./classes/SearchClient.html">SearchClient</a>

The central class is the <a href="./classes/SearchClient.html">SearchClient</a>. To start using it you will need to create a new instance of it. The constructor takes two parameters, a baseUrl and optionally a settings object. 

* The base-url is typically `"http://myserver:9950"` for theIntelliSearch SearchService. 
* The settings object has properties that help you customize the solution to your needs.
  * If you are using the "manual" mode with promises, then you can leave this empty.
  * If you want to use the "automatic" mode, then you will have to set up some of these properties.
  * Use the settings' version parameter to override the default 3 with 2 (if you are using a v2 backend rest-interface).

### <a href="./classes/Settings.html">Settings</a>

The <a href="./classes/Settings.html">Settings</a> class holds properties as follows:

* `allCategories`: <a href="./classes/AllCategoriesSettings.html">AllCategoriesSettings</a> 
* `authentication`: <a href="./classes/AuthenticationSettings.html">AuthenticationSettings</a> 
* `autocomplete`: <a href="./classes/AutocompleteSettings.html">AutocompleteSettings</a> 
* `bestBets`: <a href="./classes/BestBetsSettings.html">BestBetsSettings</a> 
* `categorize`: <a href="./classes/CategorizeSettings.html">CategorizeSettings</a> 
* `find`: <a href="./classes/FindSettings.html">FindSettings</a> 
* `query`: <a href="./classes/Query.html">Query</a> 

Please consult the documentation for specific details on each of them. Suffice to say that all the *Settings classes contains a boolean property called `enabled` , which by default is `true`. 

**Versions:**
By default the SearchClient services will use version 3 of the backend SearchService REST API. If you need to connect to the v2 REST interface then pass this in the Settings object.

## Automatic mode

The automatic mode is the simplest way for you as a developer to use the search-client. It makes it easy for you to hook up your search-ui to the search-backend, without you having to add source code to detect when and how the various features are to be executed. Instead you can "stand on shoulders" and leverage the knowledge that is already incorporated into the implemented automated triggers. You can set things up and it should "just work". We do however suggest that you invest time into understanding the various search-features and how the the triggers work. That will help you find the best way to implement the search-backend for your search.

### Update input

In order for the automatic mode to work you need to update the values in your query-field as well as filters and/or sorting order / search-type. This is how the search-client will know when to execute searches/lookups and not.

These are **properties** on the SearchClient class. It is expected that you set and get them directly:

* `clientId`: string
* `dateFrom`: <a href="./globals.html#datespecification">DateSpecification</a>
* `dateTo`: <a href="./globals.html#datespecification">DateSpecification</a>
* `filters`: string[]
* `matchGrouping`: boolean
* `matchOrderBy`: <a href="./enums/orderby.html">OrderBy</a>
* `matchPage`: number
* `matchPageSize`: number
* `maxSuggestions`: number
* `queryText`: string
* `searchType`: <a href="./enums/searchtype.html">SearchType</a>

I.e. `searchClient.queryText = "my query";`
The normal thing to do is to wire the UI events so that when the user changes the content of the query input field you immediately update the `queryText` property.

In addition the `filters` and `matchPage` properties also have a couple of helpers:

* `filterAdd(string filter)`
* `filterRemove(string filter)`
* `matchPageNext()`
* `matcPagePrev()`

### Set up triggers

The `autocomplete`, `categorize` and `find` properties are all essential parts of the automatic mode. Because of this their respective settings objects also contain a property called `trigger`: 

* <a href="./classes/AutocompleteTrigger.html">AutocompleteTrigger</a>
* <a href="./classes/CategorizeTrigger.html">CategorizeTrigger</a>
* <a href="./classes/FindTrigger.html">FindTrigger</a>

These triggers have a common set of properties, inherited from the <a href="./classes/Trigger.html">Trigger</a> class:

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

1. `cbRequest`\
  This callback is called before the request is started. Typically you will use this to control loading/waiting indicators on the page. The signature includes some optional params `(url: string, reqInit: RequestInit): bool`. **Note that if you add this callback, and explicitly return false, then the request will not be executed.** If you don't return or return false then the request runs as expected.

1. `cbSuccess`\
  This callback is called whenever a backend operation has completed and results have been received. The signature of the callback should be `(data: <dataType>) => void`, where the &lt;dataType&gt; is `string[]` for the autocomplete call, `Categories` for the categorize call and `Matches` for the find call.

1. `cbError`\
  This callback is called whenever a backend operation somehow fails to complete. The signature of the callback should be `(error: any) => void`. The error object could be anything, but should explain the cause of the problem if console.log()'ed or toString()'ed to the page.

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

**Sample:**

    // Without authentication
    let client = new SearchClient("http://server:9950/", {
        version: 3,
        authentication: {
            enables: false,
        }, 
        find: {
            cbRequest: (url, reqInit) => {
                findError = null;
                findResults = null;
                findLoading = true; 
            },
            cbSuccess: (matches) => {
                findResults = matches;
                findLoading = false; 
            },
            cbError: (error) => {
                findError = error.toString();
                findLoading = false; 
            }, 
            trigger: {
                queryChanged: true // Means that the match-results will update on queryChanges, and according to the other default trigger values. Still needs minLength and triggerdelay is also obeyed. This example allows a kind of realtime search for matches.
            }
        },
        categorize: {
            cbRequest: (url, reqInit) => {
                categorizeError = null;
                categorizeResults = null;
                categorizeLoading = true; 
            },
            cbSuccess: (categories) => {
                categorizeResults = categories;
                categorizeLoading = false; 
            },
            cbError: (error) => {
                categorizeError = error.toString();
                categorizeLoading = false; 
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
    client.findAndCategorize();

    // The registered callbacks passed to the SearchClient constructor will be called automatically to track the progress and deliver results when returned. 

## Manual mode

There is no need to update inputs or triggers. Instead the search-client will execute on your command. The results can be received in callbacks or using promises.

While it is possible to set up callbacks to handle the results of the manual fetches, it is not the recommended practice. We suggest that you instead use the Promises returned (see sample below).

In manual mode, you control which web-service to call when yourself. This is what the manual mode is all about. The typical mode of operation is still to instantiate the central SearchClient class, but to call the web-services via their respective search-client instance properties: allCategories.fetch(), authentication.fetch(), autocomplete.fetch(), bestBets.fetch(), categorize.fetch() and find.fetch().

**Sample:**

    let client = new SearchClient("http://server/RestService/v3/");

    client.find.fetch({ queryText: "Hello world" })
    .then((matches) => {
        console.log("Find results:", matches);
    })
    .catch((error) => {
        console.error(error);
    });

It is recommended to use Promises as shown in the sample above when doing manual operations.

## Deferring and suppressing registered callbacks

Please note that any of the services' registered callbacks will be called as a part of the fetch-process. This regards to both automatic and manual mode fetches. If you don't want the callbacks to be enabled you have two options:

1. For the SearchClient: Call `deferredUpdate*(true)`, before you do anything that would normally trigger callbacks. This will in turn call `deferUpdates(true)` for the appropriate services. When you want callbacks to again be activated, call the same `deferUpdate*(false, true|false)` method, using the second parameter to indicate whether pending updates are to be skipped or not.
1. For a specific service: Call its `deferUpdates(true)` before you do anything that would normally trigger callbacks. And then afterwards, if you want the callbacks to again be active, call `deferUpdates(false, true|false)` and use the second parameter to indicate whether pending updates are to be skipped or not.
1. When using manual mode: Pass a second variable to the `fetch()`-call, a boolean `suppressCallbacks` parameter, set to `true`.

## Authentication

The IntelliSearch SearchService supports using JWT (JsonWebToken) authentication for differentiating users/permissions. If the index is public and does not use authentication then you can turn off authentication (which is enabled by default) by passing this in the settings object in the SearchClient constructor: `authentication: { enabled: false }`.

If you however want to use authentication, then there are a couple of things that is important:

1. The SearchService must be configured to use the CurrentPrincipal plugin.

1. A web-service that identifies the user must be setup that is accessible from the page that the search-client runs on.
   * The web-service endpoint must identify the user and create a JWT that is returned.
   * On the server-side the JWT needs to be generated by using the same secret key as is set up in the SearchService (a random key was generated on setup and should be preconfigured).
   * A choice must be made on the expiration time for the token. It is suggested to be liberal, but to still have an expiration time. An hour would probably be fine in many cases.
   * It is suggested that the creation time property in the JWT is backdated with a minute or so to cope for time variances between the SearchService and this web-service.

1. The SearchClient authentication settings object must define:
   * The endpoint url.
   * The path for the jwt value when returned.\
     If the returned structure is `{ user: { jwt: "actualtokenhash"}}` then the tokenPath should be `["user", "jwt"]`.
   * By default

The authentication system, when enabled will attempt to fetch the authentication-token as soon as it is setup (trying to prefetch it to have it ready asap in case a search is made). 

The authentication system decodes the jwt-token when received and checks for when the token expires. It then sets up a timeout to fetch a new token in ample time before the current one expires. The overlap for this is defined in its trigger: ` authentication: { trigger: { expiryOverlap: 60 }}`. The default is 60 seconds, which means that the client will try to get a new JWT 60 seconds before the old one expires.

## Documentation / Intellisense / Types

If you are using typescript, then the datatypes are available for your IDE to use. If not, then all types and definitions are available in the generated API-documentation in the search-client doc-folder (typically ./node_modules/search-client/doc/index.html).
