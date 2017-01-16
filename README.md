# IntelliSearch Search Client

## Production
The SearchClient is available from this npm package via first installing this project:

    > npm install --save search-client

Then in your source-code you can import it like this (ES6 style):

    import SearchClient, { Settings } from 'search-client';

You can then instantiate it with:

    let settings = new Settings();
    settings.baseUrl = "http://intellisearch.myserver.com";
    let searchClient = new SearchClient(settings);

See the API documentation for further instructions.

If you are using typescript then the definitions should automatically be included. 
You will then benefit from having typesafe results and intellisense (dependeing on 
development IDE in use).

## Development
In development mode, to run the tests and have the REST endpoint mocked you have to:

    npm install --global json-server

You then have to run the following command from the root of the project:

    json-server test-data.json

## Questions, issues and bugs 
Please report to the repo (www.github.com/intellisearch/search-client).
We are also happy to receive pull-requests to add features or fix issues.