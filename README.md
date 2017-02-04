# IntelliSearch Search Client

Makes it easy to search IntelliSearch indexes from javascript/typescript.

What does the package include:
---
    1. Javascript library ready to use in npm projects
    2. Typescript definitions included.
    3. Javascript file ready to include in script tag. 

## Usage

npm
---

The SearchClient is available from this npm package via first installing this project:

    > npm install --save search-client

Then in your source-code you can import it like this (ES6 style):

    import { SearchClient } from 'search-client';

You can then initialize the search-client with:

    let searchClient = new SearchClient("http://intellisearch.myserver.com");

See the API documentation for further instructions.

If you are using typescript then the definitions are automatically also included.
You will then benefit from having typesafe results and intellisense (dependeing on
which development IDE you use).

browser
---

A script suitable for inclusion into webpages via the `<script>-tag` is also 
included, named: `search-client.browser.js`.

## Development

For developing on this package:

1. Clone the project from http://www.github.com/intellisearch/search-client
2. Run `yarn install` (we use yarn mainly for the benefit of it's lockfile, but we stick to it)
3. Run `yarn test:watch` to continuosly monitor your changes.
4. The typescript source-code is located in the src folder.

**Note:** 
Even if the test-run is not producing errors, you are not all in the safe zone. The 
actual build may produce errors that the test-suite is not catching. This is mainly 
due to the fact that they have slightly different build procedures. One of the differences
is that the `yarn run build` command is also executing tslint to enforce good code style.
We are happy to receive pull-requests for features and bugfixes.

Please report bugs on the GitHub project: http://www.github.com/intellisearch/search-client
